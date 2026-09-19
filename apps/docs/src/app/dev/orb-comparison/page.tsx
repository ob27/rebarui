"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Design comparison tool for the FloatAssistant orb.
 * Left: reference video/image
 * Right: current WebGL implementation
 *
 * Access at /dev/orb-comparison during development only.
 */
export default function OrbComparisonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    const size = 400;
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.position.z = 2;

    // Create metaball shader material
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uActivity;

      varying vec3 vPosition;
      varying vec3 vNormal;

      // Simplex noise function
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
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        // Displace vertices based on noise
        float noise = snoise(vPosition * 2.0 + uTime * 0.5);
        float displacement = noise * 0.15 * uActivity;

        vec3 displacedPosition = vPosition + vNormal * displacement;

        // Calculate lighting
        vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));
        float diff = max(dot(vNormal, lightDir), 0.0);
        float ambient = 0.3;

        // Fresnel effect for glow
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);

        // Color with gradient
        vec3 color = uColor * (ambient + diff * 0.7);
        color += vec3(1.0, 1.0, 1.0) * fresnel * 0.5;

        // Add noise-based color variation
        color += vec3(noise * 0.1) * uActivity;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x0066cc) },
        uActivity: { value: 1.0 },
      },
    });

    // Create multiple spheres for metaball effect
    const group = new THREE.Group();
    const sphereCount = 5;
    const spheres: THREE.Mesh[] = [];

    for (let i = 0; i < sphereCount; i++) {
      const geometry = new THREE.SphereGeometry(0.4, 32, 32);
      const sphere = new THREE.Mesh(geometry, material);

      const angle = (i / sphereCount) * Math.PI * 2;
      sphere.position.set(
        Math.cos(angle) * 0.3,
        Math.sin(angle) * 0.3,
        0
      );

      spheres.push(sphere);
      group.add(sphere);
    }

    // Center sphere
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const centerSphere = new THREE.Mesh(centerGeometry, material);
    group.add(centerSphere);

    scene.add(group);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      material.uniforms.uTime.value = time;

      // Rotate spheres in organic pattern
      spheres.forEach((sphere, i) => {
        const angle = (i / sphereCount) * Math.PI * 2 + time * 0.5;
        const radius = 0.3 + Math.sin(time * 2 + i) * 0.1;
        sphere.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          Math.sin(time + i) * 0.1
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  const takeSnapshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setSnapshot(dataUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith("video/") || file.type.startsWith("image/"))) {
      setReferenceFile(file);
      setReferenceUrl(URL.createObjectURL(file));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
      setReferenceUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Orb Design Comparison</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        Left: Reference design | Right: Current WebGL implementation
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Reference side */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Reference</h2>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? "#0066cc" : "#e0e0e0"}`,
              borderRadius: "12px",
              overflow: "hidden",
              background: "#000",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "border-color 0.2s",
            }}
          >
            {referenceUrl ? (
              referenceFile?.type.startsWith("video/") ? (
                <video
                  src={referenceUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <img
                  src={referenceUrl}
                  alt="Reference"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              )
            ) : (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <p style={{ color: "#666", marginBottom: "1rem" }}>
                  Drag & drop video/image here
                </p>
                <label
                  style={{
                    display: "inline-block",
                    padding: "0.5rem 1rem",
                    background: "#333",
                    color: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                  }}
                >
                  Or click to browse
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileInput}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            )}
            {isDragging && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0, 102, 204, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0066cc",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                }}
              >
                Drop to load reference
              </div>
            )}
          </div>
          {referenceFile && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
              Loaded: {referenceFile.name}
            </p>
          )}
        </div>

        {/* Implementation side */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Current Implementation</h2>
          <div
            style={{
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#000",
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={takeSnapshot}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#0066cc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
           Take Snapshot
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          Show Grid Overlay
        </label>
      </div>

      {/* Snapshot comparison */}
      {snapshot && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Latest Snapshot</h2>
          <img
            src={snapshot}
            alt="Orb snapshot"
            style={{
              maxWidth: "400px",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
            }}
          />
        </div>
      )}

      {/* Notes section */}
      <div style={{ marginTop: "2rem", padding: "1.5rem", background: "#f5f5f5", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Design Notes</h2>
        <ul style={{ lineHeight: "1.8" }}>
          <li>Target: Siri-like fluid metaball effect</li>
          <li>Key elements: organic movement, color gradients, audio reactivity</li>
          <li>Current status: Basic Three.js spheres with noise displacement</li>
          <li>Next steps: Implement proper metaball shader, add audio reactivity</li>
        </ul>
      </div>
    </div>
  );
}
