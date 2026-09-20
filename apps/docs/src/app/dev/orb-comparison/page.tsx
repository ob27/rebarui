"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Button, Slider, Stack, Text } from "rebar-ui";

// Every tunable knob in the shader/bloom pipeline, in one place — the slider panel, the uniform
// wiring, and the "copy for an agent" text block are all driven off this single list so adding a
// new knob later means adding one entry here, not touching four different spots by hand.
interface OrbParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  target: "uniform" | "bloom";
}

const PARAMS: OrbParam[] = [
  { key: "shellThickness", label: "Shell thickness", min: 0.02, max: 0.3, step: 0.01, default: 0.08, target: "uniform" },
  { key: "openingSize", label: "Opening size (how much is cut away)", min: 0, max: 0.95, step: 0.01, default: 0.22, target: "uniform" },
  { key: "rotationSpeed", label: "Tumble speed", min: 0, max: 1, step: 0.01, default: 0.6, target: "uniform" },
  { key: "rimIntensity", label: "Rim glow intensity", min: 0, max: 3, step: 0.05, default: 0.9, target: "uniform" },
  { key: "innerBrightness", label: "Inner cavity brightness", min: 0.5, max: 2.5, step: 0.05, default: 1.15, target: "uniform" },
  { key: "edgeSoftness", label: "Edge softness (ephemeral fade)", min: 0.02, max: 1, step: 0.02, default: 0.35, target: "uniform" },
  { key: "noiseScale", label: "Noise scale", min: 0.5, max: 4, step: 0.1, default: 2.0, target: "uniform" },
  { key: "timeScale", label: "Flame speed (time scale)", min: 0.05, max: 1, step: 0.01, default: 0.3, target: "uniform" },
  { key: "darkness", label: "Base darkness", min: 0.2, max: 1, step: 0.05, default: 0.6, target: "uniform" },
  { key: "hotLow", label: "Hot core low edge", min: 0, max: 1, step: 0.01, default: 0.55, target: "uniform" },
  { key: "hotHigh", label: "Hot core high edge", min: 0, max: 1, step: 0.01, default: 0.85, target: "uniform" },
  { key: "hotIntensity", label: "Hot core intensity", min: 0, max: 3, step: 0.05, default: 0.7, target: "uniform" },
  { key: "envelopeSpeed", label: "Flame envelope speed (grow/shrink rate)", min: 0.02, max: 1, step: 0.01, default: 0.12, target: "uniform" },
  { key: "envelopeAmount", label: "Flame envelope range (how much it pulses)", min: 0, max: 0.6, step: 0.02, default: 0.35, target: "uniform" },
  { key: "fresnelPower", label: "Fresnel power", min: 0.5, max: 5, step: 0.1, default: 2.0, target: "uniform" },
  { key: "fresnelIntensity", label: "Fresnel intensity", min: 0, max: 1.5, step: 0.05, default: 0.4, target: "uniform" },
  { key: "grainAmount", label: "Grain amount", min: 0, max: 0.1, step: 0.005, default: 0.03, target: "uniform" },
  { key: "bloomStrength", label: "Bloom strength", min: 0, max: 3, step: 0.05, default: 0.5, target: "bloom" },
  { key: "bloomRadius", label: "Bloom radius", min: 0, max: 1, step: 0.02, default: 0.4, target: "bloom" },
  { key: "bloomThreshold", label: "Bloom threshold", min: 0, max: 1, step: 0.02, default: 0.8, target: "bloom" },
];

const defaultParams = (): Record<string, number> =>
  Object.fromEntries(PARAMS.map((p) => [p.key, p.default]));

export default function OrbComparisonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const [referenceUrl] = useState<string>("/reference-orb.mp4");
  const [params, setParams] = useState<Record<string, number>>(defaultParams);
  const [copied, setCopied] = useState(false);

  const setParam = (key: string, value: number) => setParams((prev) => ({ ...prev, [key]: value }));

  // A random value per param, snapped to that param's own step so the slider thumb lands exactly
  // where a real drag would — quick way to stumble onto an interesting combination rather than
  // hand-tuning 15+ sliders one at a time from a cold start.
  const randomizeParams = () => {
    setParams(
      Object.fromEntries(
        PARAMS.map((p) => {
          const steps = Math.round((p.max - p.min) / p.step);
          const value = p.min + Math.floor(Math.random() * (steps + 1)) * p.step;
          return [p.key, Math.round(value * 1000) / 1000];
        }),
      ),
    );
  };

  // One-time WebGL/scene setup — reads `params` only for the *initial* uniform values (this
  // effect's own closure is frozen at first mount); every value stays live afterward via the
  // separate sync effect below, so tweaking a slider never tears down and rebuilds the GL context.
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    // getBoundingClientRect (not clientWidth/clientHeight) — the container's size comes from
    // `aspectRatio: "1"` on its parent, and reading it via the rect is the reliable way to get
    // the real post-layout box regardless of exactly when this effect fires relative to layout.
    const rect = canvas.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    const initial = defaultParams();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    renderer.setPixelRatio(pixelRatio);
    // The hot-core, rim, and inner-cavity boosts all stack additively on the same pixel (e.g. a
    // bright inner-wall pixel that's also on the rim during a hot-mask flare) and easily exceed
    // 1.0 several times over. Without tone mapping that just hard-clips to flat white the moment
    // any one term runs hot, so the whole disc reads as a single white blob with the bloom pass
    // having nothing left to select against. ACES compresses the highlights instead of clipping
    // them, so real color variation survives even in the bright regions.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    // The real bug behind "orb stuck in a corner": `setSize`'s default `updateStyle=true`
    // overwrites the canvas's own `style.width`/`style.height` with fixed pixel values, fighting
    // the JSX's `width: 100%; height: 100%`. Passing `false` leaves our own CSS sizing alone and
    // only sets the WebGL drawing buffer resolution.
    renderer.setSize(width, height, false);

    // Bloom post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      initial.bloomStrength,
      initial.bloomRadius,
      initial.bloomThreshold,
    );
    composer.addPass(bloomPass);
    bloomPassRef.current = bloomPass;
    // Tone mapping only takes effect on the pass that actually writes to the screen. UnrealBloomPass
    // composites in linear space with `renderToScreen` off by default here, so without this final
    // pass the renderer's ACES tone mapping never runs and highlights hard-clip to white instead of
    // compressing.
    composer.addPass(new OutputPass());

    // Fullscreen quad with the orb shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        // Device pixels, not CSS pixels — must match what gl_FragCoord actually reports (the real
        // framebuffer resolution), or the shader's "screen center" calculation is off by exactly
        // the device pixel ratio on any HiDPI/Retina display, shifting where the sphere renders.
        // On a DPR-1 display (most headless test browsers) this bug is invisible, which is why it
        // slipped through an earlier round of testing.
        uResolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
        uShellThickness: { value: initial.shellThickness },
        uOpeningSize: { value: initial.openingSize },
        uRotationSpeed: { value: initial.rotationSpeed },
        uRimIntensity: { value: initial.rimIntensity },
        uInnerBrightness: { value: initial.innerBrightness },
        uEdgeSoftness: { value: initial.edgeSoftness },
        uEnvelopeSpeed: { value: initial.envelopeSpeed },
        uEnvelopeAmount: { value: initial.envelopeAmount },
        uNoiseScale: { value: initial.noiseScale },
        uTimeScale: { value: initial.timeScale },
        uDarkness: { value: initial.darkness },
        uHotLow: { value: initial.hotLow },
        uHotHigh: { value: initial.hotHigh },
        uHotIntensity: { value: initial.hotIntensity },
        uFresnelPower: { value: initial.fresnelPower },
        uFresnelIntensity: { value: initial.fresnelIntensity },
        uGrainAmount: { value: initial.grainAmount },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uShellThickness;
        uniform float uOpeningSize;
        uniform float uRotationSpeed;
        uniform float uRimIntensity;
        uniform float uInnerBrightness;
        uniform float uEdgeSoftness;
        uniform float uEnvelopeSpeed;
        uniform float uEnvelopeAmount;
        uniform float uNoiseScale;
        uniform float uTimeScale;
        uniform float uDarkness;
        uniform float uHotLow;
        uniform float uHotHigh;
        uniform float uHotIntensity;
        uniform float uFresnelPower;
        uniform float uFresnelIntensity;
        uniform float uGrainAmount;
        varying vec2 vUv;

        // Simplex noise from Ashima/webgl-noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        // Fractal Brownian Motion
        float fbm(vec3 p) {
          float f = 0.0;
          f += 0.5000 * snoise(p); p *= 2.02;
          f += 0.2500 * snoise(p); p *= 2.03;
          f += 0.1250 * snoise(p); p *= 2.01;
          f += 0.0625 * snoise(p);
          return f;
        }

        // Domain-warped FBM - the "flame" effect
        float warpedFbm(vec3 p, float time) {
          vec3 q = vec3(fbm(p + vec3(0.0, 0.0, time)),
                        fbm(p + vec3(5.2, 1.3, time)),
                        fbm(p + vec3(1.7, 9.2, time)));
          vec3 r = vec3(fbm(p + 4.0 * q + vec3(1.7, 9.2, 0.15 * time)),
                        fbm(p + 4.0 * q + vec3(8.3, 2.8, 0.126 * time)),
                        fbm(p + 4.0 * q + vec3(1.8, 8.3, 0.15 * time)));
          return fbm(p + 4.0 * r);
        }

        // IQ's cosine palette
        vec3 palette(float t) {
          vec3 a = vec3(0.5, 0.5, 0.5);
          vec3 b = vec3(0.5, 0.5, 0.5);
          vec3 c = vec3(1.0, 1.0, 1.0);
          vec3 d = vec3(0.263, 0.416, 0.557); // Indigo to magenta to white
          return a + b * cos(6.28318 * (c * t + d));
        }

        // Analytic ray-sphere intersection — used only as a cheap bounding test to skip the
        // raymarch entirely on rays that miss the shell's outer bound, and to pick a sensible
        // start distance for the ones that don't.
        float sphereIntersect(vec3 ro, vec3 rd, float radius) {
          float b = dot(ro, rd);
          float c = dot(ro, ro) - radius * radius;
          float h = b * b - c;
          if (h < 0.0) return -1.0;
          return -b - sqrt(h);
        }

        // Real reference frames (extracted directly from reference-orb.mp4, not guessed from a
        // couple of screenshots) show at least four distinct silhouettes across the 15s loop: a
        // near-full circle, a narrow edge-on lens, a circle with a Pac-Man-style wedge notch, and a
        // circle with a bright seam/crack crossing its face. That's a single rigid shape tumbling
        // in 3D, not a fixed sphere with only an internal effect — specifically a hollow spherical
        // shell with a circular opening (a "bowl"), where the opening's rim always reads as a
        // distinct bright edge because it's a real exposed cut face, not a shading trick.
        #define SHELL_RADIUS 0.8

        vec3 rotateAxis(vec3 p, vec3 axis, float angle) {
          float s = sin(angle);
          float c = cos(angle);
          return p * c + cross(axis, p) * s + axis * dot(axis, p) * (1.0 - c);
        }

        // Two fixed, non-parallel axes at different speeds — a real tumble, not a spin around one
        // axis (which would repeat its silhouette every rotation and never look like the reference).
        vec3 tumble(vec3 p, float t) {
          p = rotateAxis(p, normalize(vec3(0.4, 1.0, 0.2)), t * 0.7);
          p = rotateAxis(p, normalize(vec3(1.0, 0.3, 0.5)), t * 0.45);
          return p;
        }

        // The two CSG halves, kept separate (rather than pre-combined into one float) so the
        // caller can tell which surface is active at a hit point: whichever of the two is larger
        // is the one actually forming the boundary there (see isCutFace in main()).
        vec2 sceneSDFParts(vec3 p, float t, float cutHeight, float thickness) {
          vec3 pObj = tumble(p, t);
          float shell = abs(length(pObj) - SHELL_RADIUS) - thickness;
          float cut = pObj.z - cutHeight;
          return vec2(shell, cut);
        }

        float sceneSDF(vec3 p, float t, float cutHeight, float thickness) {
          vec2 parts = sceneSDFParts(p, t, cutHeight, thickness);
          return max(parts.x, parts.y);
        }

        vec3 calcNormal(vec3 p, float t, float cutHeight, float thickness) {
          vec2 e = vec2(0.001, 0.0);
          return normalize(vec3(
            sceneSDF(p + e.xyy, t, cutHeight, thickness) - sceneSDF(p - e.xyy, t, cutHeight, thickness),
            sceneSDF(p + e.yxy, t, cutHeight, thickness) - sceneSDF(p - e.yxy, t, cutHeight, thickness),
            sceneSDF(p + e.yyx, t, cutHeight, thickness) - sceneSDF(p - e.yyx, t, cutHeight, thickness)
          ));
        }

        // Dithering
        float dither(vec2 coord, float time) {
          return fract(sin(dot(coord, vec2(12.9898, 78.233)) + time) * 43758.5453);
        }

        void main() {
          // Centered UV
          vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);

          vec3 ro = vec3(0.0, 0.0, 2.5);
          vec3 rd = normalize(vec3(uv * 1.5, -1.0));

          float rotT = uTime * uRotationSpeed;
          // openingSize 0 = closed sphere, 1 = fully removed; the cut plane's local-z offset runs
          // from +radius (nothing cut) down through 0 (an exact half-shell "bowl") to -radius.
          float cutHeight = SHELL_RADIUS * (1.0 - 2.0 * uOpeningSize);

          float outerBound = SHELL_RADIUS + uShellThickness + 0.05;
          float tBound = sphereIntersect(ro, rd, outerBound);
          if (tBound < 0.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
          }

          float dist = max(tBound - 0.05, 0.0);
          float maxDist = tBound + outerBound * 2.2;
          bool didHit = false;
          vec3 pos = ro;
          for (int i = 0; i < 64; i++) {
            pos = ro + rd * dist;
            float d = sceneSDF(pos, rotT, cutHeight, uShellThickness);
            if (d < 0.001) { didHit = true; break; }
            dist += d;
            if (dist > maxDist) break;
          }

          if (!didHit) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
          }

          vec3 normal = calcNormal(pos, rotT, cutHeight, uShellThickness);
          vec3 viewDirRaw = normalize(ro - pos);

          vec3 pObj = tumble(pos, rotT);
          vec2 parts = sceneSDFParts(pos, rotT, cutHeight, uShellThickness);
          bool isCutFace = parts.y > parts.x;
          bool isInner = length(pObj) < SHELL_RADIUS;

          // Domain-warped noise for flame effect — sampled in object space so the texture reads as
          // baked onto the tumbling shell rather than sliding across it independently.
          float noise = warpedFbm(pObj * uNoiseScale, uTime * uTimeScale);

          float colorT = noise * 0.4 + 0.3;
          vec3 color = palette(colorT) * uDarkness;

          // TEMP DEBUG
          gl_FragColor = vec4(isCutFace ? 1.0 : 0.0, isInner ? 1.0 : 0.0, 0.0, 1.0);
          return;

          // The "flame envelope" — a slow, large-scale, single-octave noise that shifts the
          // hot-mask threshold up and down over time, so the flame's apparent extent pulses
          // without the shell's own boundary moving.
          float envelope = snoise(pObj * 0.8 + vec3(0.0, 0.0, uTime * uEnvelopeSpeed));
          float hotLow = clamp(uHotLow - envelope * uEnvelopeAmount, 0.0, 1.0);
          float hotHigh = clamp(uHotHigh - envelope * uEnvelopeAmount, hotLow + 0.05, 1.0);
          float hotMask = smoothstep(hotLow, hotHigh, noise);
          color += vec3(1.0, 0.5, 0.9) * hotMask * uHotIntensity;

          // The cavity wall seen through the opening reads brighter/pinker than the outer shell in
          // every reference frame that shows it.
          if (isInner) {
            color *= uInnerBrightness;
          }

          // The opening's rim is a real exposed cut face (see sceneSDFParts), not a shading trick —
          // boost it directly so bloom picks it up as the bright seam/wedge edge seen in every
          // reference frame.
          if (isCutFace) {
            float rimNoise = 0.85 + 0.15 * noise;
            color += vec3(1.0, 0.65, 0.92) * rimNoise * uRimIntensity;
          }

          // Fresnel rim lighting
          float NdotV = max(dot(normal, viewDirRaw), 0.0);
          float fresnel = pow(1.0 - NdotV, uFresnelPower);
          color += vec3(0.4, 0.2, 0.6) * fresnel * uFresnelIntensity;

          // Dithering for grain effect
          float grain = dither(gl_FragCoord.xy, uTime) * (uGrainAmount * 2.0) - uGrainAmount;
          color += grain;

          // Ephemeral/translucent edge, not a hard-cut opaque silhouette: at a grazing view angle
          // (NdotV -> 0, i.e. the true silhouette) alpha fades toward 0 instead of staying at a
          // flat 1.0 everywhere the ray happened to hit geometry.
          float alpha = smoothstep(0.0, uEdgeSoftness, NdotV);

          gl_FragColor = vec4(color, alpha);
        }
      `,
    });
    materialRef.current = material;

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // No resize handling existed at all before — harmless on a fixed-layout dev comparison page
    // today, but the same missing-resize gap that would otherwise re-introduce the corner bug the
    // moment this canvas sits in anything that actually resizes (a real FloatAssistant panel, a
    // browser window resize).
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect();
      width = newRect.width;
      height = newRect.height;
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      material.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", handleResize);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      material.uniforms.uTime.value = time;

      composer.render();
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      materialRef.current = null;
      bloomPassRef.current = null;
      renderer.dispose();
      composer.dispose();
    };
  }, []);

  // Pushes every slider value into the live material/bloom pass — imperative, not through props,
  // since three.js objects live outside React's own tree.
  useEffect(() => {
    const material = materialRef.current;
    const bloomPass = bloomPassRef.current;
    if (!material || !bloomPass) return;
    material.uniforms.uShellThickness.value = params.shellThickness;
    material.uniforms.uOpeningSize.value = params.openingSize;
    material.uniforms.uRotationSpeed.value = params.rotationSpeed;
    material.uniforms.uRimIntensity.value = params.rimIntensity;
    material.uniforms.uInnerBrightness.value = params.innerBrightness;
    material.uniforms.uEdgeSoftness.value = params.edgeSoftness;
    material.uniforms.uEnvelopeSpeed.value = params.envelopeSpeed;
    material.uniforms.uEnvelopeAmount.value = params.envelopeAmount;
    material.uniforms.uNoiseScale.value = params.noiseScale;
    material.uniforms.uTimeScale.value = params.timeScale;
    material.uniforms.uDarkness.value = params.darkness;
    material.uniforms.uHotLow.value = params.hotLow;
    material.uniforms.uHotHigh.value = params.hotHigh;
    material.uniforms.uHotIntensity.value = params.hotIntensity;
    material.uniforms.uFresnelPower.value = params.fresnelPower;
    material.uniforms.uFresnelIntensity.value = params.fresnelIntensity;
    material.uniforms.uGrainAmount.value = params.grainAmount;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    bloomPass.threshold = params.bloomThreshold;
  }, [params]);

  const copyText = useMemo(
    () =>
      [
        "Orb shader tuning (from /dev/orb-comparison):",
        ...PARAMS.map((p) => `${p.key}: ${params[p.key]}`),
      ].join("\n"),
    [params],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can throw in an insecure/unsupported context — nothing to recover from
      // beyond not falsely claiming success.
    }
  };

  const uniformParams = PARAMS.filter((p) => p.target === "uniform");
  const bloomParams = PARAMS.filter((p) => p.target === "bloom");

  return (
    <div style={{ padding: "2rem", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Orb Design Comparison</h1>

      {/* Reference/Current sit beside the Mutations panel (not above it) specifically so both the
          live render and the sliders driving it are visible at once — the previous layout put the
          panel below two large square previews, pushing it off-screen the moment either preview
          was tall enough to fill the viewport. The panel is sticky + independently scrollable so
          it stays in view regardless of overall page scroll position. */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 360px", gap: "1.5rem", alignItems: "start" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Reference</h2>
          <div
            style={{
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#000",
              aspectRatio: "1",
            }}
          >
            <video
              src={referenceUrl}
              controls
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Current Implementation</h2>
          <div
            style={{
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#000",
              aspectRatio: "1",
            }}
          >
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
          </div>
        </div>

        <Stack
          gap="md"
          style={{
            position: "sticky",
            top: "2rem",
            maxHeight: "calc(100vh - 4rem)",
            overflowY: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "12px",
            padding: "1rem",
          }}
        >
          <Stack gap="sm">
            <h2 style={{ fontSize: "1.25rem" }}>Mutations</h2>
            <Stack direction="row" gap="sm" style={{ flexWrap: "wrap" }}>
              <Button variant="secondary" size="sm" onClick={() => setParams(defaultParams())}>
                Reset to defaults
              </Button>
              <Button variant="secondary" size="sm" onClick={randomizeParams}>
                Random mutation
              </Button>
              <Button size="sm" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy for agent"}
              </Button>
            </Stack>
          </Stack>

          <Text size="sm" color="secondary">
            Shader
          </Text>
          {uniformParams.map((p) => (
            <Stack key={p.key} gap="xs">
              <Stack direction="row" style={{ justifyContent: "space-between" }}>
                <Text size="sm">{p.label}</Text>
                <Text size="sm" color="secondary">
                  {params[p.key]}
                </Text>
              </Stack>
              <Slider
                aria-label={p.label}
                min={p.min}
                max={p.max}
                step={p.step}
                value={params[p.key]}
                onValueChange={(v) => setParam(p.key, v)}
              />
            </Stack>
          ))}

          <Text size="sm" color="secondary" style={{ marginTop: "0.5rem" }}>
            Bloom
          </Text>
          {bloomParams.map((p) => (
            <Stack key={p.key} gap="xs">
              <Stack direction="row" style={{ justifyContent: "space-between" }}>
                <Text size="sm">{p.label}</Text>
                <Text size="sm" color="secondary">
                  {params[p.key]}
                </Text>
              </Stack>
              <Slider
                aria-label={p.label}
                min={p.min}
                max={p.max}
                step={p.step}
                value={params[p.key]}
                onValueChange={(v) => setParam(p.key, v)}
              />
            </Stack>
          ))}
        </Stack>
      </div>
    </div>
  );
}
