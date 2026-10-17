"use client";

import { useState } from "react";
import { Button, Heading, Stack, Text, WaveformAudioPlayer } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";

const CODE = `<WaveformAudioPlayer src={reading.audio} autoPlay playing={playing} onPlayingChange={setPlaying}
  trailingAction={<Button variant="tertiary" aria-label="Save to Library">Save</Button>}
  onEnded={markListened} error={failed && "Couldn’t play this recording."} onRetry={reload} />`;

const SRC = "/narration-first-reading.mp3";

/** trailingAction, controlled playing, ended, buffering and error. */
export function NewBStages() {
  const [saved, setSaved] = useState(false);
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [failed, setFailed] = useState(true);
  return (
    <>
      <Heading level={2}>Trailing action, playback state, error</Heading>
      <DemoStage
        title="Narration bar"
        caption="Two bars share one playing state, so starting one pauses the other"
        code={CODE}
        widths={false}
        states={[
          { label: "Buffering", node: <WaveformAudioPlayer src={SRC} loading barCount={20} aria-label="Buffering narration" /> },
          { label: "On dark", node: <div style={{ background: "var(--rebar-color-bg-inverse)", padding: 12, borderRadius: 14 }}><WaveformAudioPlayer src={SRC} tone="onDark" barCount={20} aria-label="Prayer narration" /></div> },
        ]}
      >
        <Stack gap="md">
          <WaveformAudioPlayer
            src={SRC}
            aria-label="First reading narration"
            playing={a}
            onPlayingChange={(p) => {
              setA(p);
              if (p) setB(false);
            }}
            trailingAction={<Button size="sm" variant="tertiary" aria-label={saved ? "Saved" : "Save to Library"} onClick={() => setSaved((s) => !s)}>{saved ? "Saved" : "Save"}</Button>}
          />
          <WaveformAudioPlayer
            src="/narration-gospel.mp3"
            aria-label="Gospel narration"
            playing={b}
            onPlayingChange={(p) => {
              setB(p);
              if (p) setA(false);
            }}
          />
          <WaveformAudioPlayer src="/narration-psalm.mp3" aria-label="Psalm narration, failed" error={failed ? "Couldn’t play this recording. Check your connection and tap play to try again." : false} onRetry={() => setFailed(false)} />
          <Text size="xs" color="secondary">Narration files are not bundled with this site, so playback itself needs real audio; the bar, state and error handling are live.</Text>
        </Stack>
      </DemoStage>
    </>
  );
}
