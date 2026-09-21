"use client";

import { useState } from "react";
import { Heading, Stack, Text, VoiceInputBar } from "rebar-ui";
import type { VoiceInputBarState } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Code",
    body: [
      {
        kind: "code",
        code: '<VoiceInputBar\n  state={state}\n  onMicPress={toggleListening}\n  onKeyboardToggle={() => setMode("text")}\n/>',
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["VoiceInputBar"] ?? [] },
  {
    type: "doc-section",
    heading: "Presentational — no real audio capture inside",
    body: [
      {
        kind: "text",
        text: "The caller owns real microphone capture and drives this component via `state`, the same convention VoiceComposer/TextToSpeechBar already follow — there's no `MediaRecorder`/`AnalyserNode` wiring in here. The waveform is decorative (a deterministic, seeded pseudo-random bar pattern — the same technique WaveformAudioPlayer uses for its own bars), not real amplitude analysis, matching this project's low-fidelity philosophy.",
      },
      {
        kind: "text",
        text: 'This is `FloatAssistant`\'s own voice-mode input, pulled out into its own reusable component — see the `mode === "voice"` branch of `FloatAssistant.tsx`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="voice-input-bar"`, `data-rebar-state` mirrors the current `state`; parts include `waveform`, `status`, `mic-button`, `keyboard-toggle`, `camera-button`.',
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Migrating to Ant Design",
    body: [
      {
        kind: "text",
        text: "Not codemod-covered — compose AntD's own circular `Button`s directly against the same state machine; there's no direct AntD equivalent of the waveform strip.",
      },
    ],
  },
];

export default function VoiceInputBarPage() {
  const [state, setState] = useState<VoiceInputBarState>("idle");

  const handleMicPress = () => {
    if (state === "idle") {
      setState("listening");
    } else if (state === "listening") {
      setState("processing");
      setTimeout(() => setState("idle"), 1200);
    }
  };

  return (
    <Stack gap="lg">
      <Heading level={1}>VoiceInputBar</Heading>
      <Text color="secondary">
        The voice-capture-mode UI: a waveform strip, a status line, a large glowing center mic
        button, and flanking keyboard-toggle/camera buttons. Click the mic below to try it.
      </Text>

      <div
        style={{
          maxWidth: 420,
          border: "1px solid var(--rebar-color-border, #e0e0e0)",
          borderRadius: 12,
        }}
      >
        <VoiceInputBar state={state} onMicPress={handleMicPress} onKeyboardToggle={() => setState("idle")} />
      </div>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
