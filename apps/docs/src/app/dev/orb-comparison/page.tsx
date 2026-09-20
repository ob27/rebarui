"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { OrbRendererHandle, OrbVariant, OrbVariantId } from "rebar-ui/orb-shader";
import { ORB_VARIANTS, defaultOrbParams } from "rebar-ui/orb-shader";
import { Button, SegmentedControl, Slider, Stack, Text } from "rebar-ui";

export default function OrbComparisonPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<OrbRendererHandle | null>(null);
  const [referenceUrl] = useState<string>("/reference-orb.mp4");
  const [variantId, setVariantId] = useState<OrbVariantId>("solid");
  const [paramsByVariant, setParamsByVariant] = useState<Record<OrbVariantId, Record<string, number>>>(() => ({
    solid: defaultOrbParams(ORB_VARIANTS.solid),
    flow: defaultOrbParams(ORB_VARIANTS.flow),
  }));
  const [copied, setCopied] = useState(false);

  // The setup effect below only depends on `variantId` (it must not tear down and rebuild the GL
  // context on every slider drag), so it reads tuned values for the *other*, currently-inactive
  // variant through this ref rather than through `paramsByVariant` directly — otherwise switching
  // variants would always reset to that variant's un-tuned defaults.
  const paramsByVariantRef = useRef(paramsByVariant);
  useEffect(() => {
    paramsByVariantRef.current = paramsByVariant;
  }, [paramsByVariant]);

  const variant: OrbVariant = ORB_VARIANTS[variantId];
  const params = paramsByVariant[variantId];

  const setParam = (key: string, value: number) =>
    setParamsByVariant((prev) => ({ ...prev, [variantId]: { ...prev[variantId], [key]: value } }));

  const resetParams = () =>
    setParamsByVariant((prev) => ({ ...prev, [variantId]: defaultOrbParams(variant) }));

  // A random value per param, snapped to that param's own step so the slider thumb lands exactly
  // where a real drag would — quick way to stumble onto an interesting combination rather than
  // hand-tuning every slider one at a time from a cold start.
  const randomizeParams = () => {
    setParamsByVariant((prev) => ({
      ...prev,
      [variantId]: Object.fromEntries(
        variant.params.map((p) => {
          const steps = Math.round((p.max - p.min) / p.step);
          const value = p.min + Math.floor(Math.random() * (steps + 1)) * p.step;
          return [p.key, Math.round(value * 1000) / 1000];
        }),
      ),
    }));
  };

  // One-time WebGL/scene setup per variant, via the same `createOrbRenderer` factory
  // AssistantOrb's persona rendering uses (imported here through the `rebar-ui/orb-shader`
  // subpath) — this sandbox and the real component can never visually drift apart. Reads tuned
  // values only for the *initial* params (this effect's own closure is frozen at the moment it
  // runs); every value stays live afterward via the separate sync effect below, so tweaking a
  // slider never tears down and rebuilds the GL context. Switching variants needs a full rebuild
  // — the two variants compile entirely different shader programs.
  useEffect(() => {
    if (!canvasRef.current) return;
    const initial = paramsByVariantRef.current[variant.id];
    let handle: OrbRendererHandle | undefined;
    let cancelled = false;

    import("rebar-ui/orb-shader").then(({ createOrbRenderer }) => {
      if (cancelled || !canvasRef.current) return;
      handle = createOrbRenderer(canvasRef.current, variant.id, initial);
      rendererRef.current = handle;
    });

    return () => {
      cancelled = true;
      handle?.dispose();
      rendererRef.current = null;
    };
  }, [variant]);

  // Pushes every slider value into the live renderer instantly (not smoothed — a slider drag
  // should feel direct) — imperative, not through props, since the renderer lives outside React's
  // own tree.
  useEffect(() => {
    rendererRef.current?.setParams(params, { smooth: false });
  }, [params]);

  const copyText = useMemo(
    () =>
      [
        `${variant.label} shader tuning (from /dev/orb-comparison):`,
        ...variant.params.map((p) => `${p.key}: ${params[p.key]}`),
      ].join("\n"),
    [variant, params],
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

  const uniformParams = variant.params.filter((p) => p.target === "uniform");
  const bloomParams = variant.params.filter((p) => p.target === "bloom");

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
          <Stack direction="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem" }}>{variant.label}</h2>
            <SegmentedControl
              value={variantId}
              onValueChange={(v) => setVariantId(v as OrbVariantId)}
              options={[
                { value: "solid", label: "Solid Orb" },
                { value: "flow", label: "Flow Orb" },
              ]}
            />
          </Stack>
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
              <Button variant="secondary" size="sm" onClick={resetParams}>
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
