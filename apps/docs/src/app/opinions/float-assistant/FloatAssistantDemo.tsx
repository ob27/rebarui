"use client";

import { FloatAssistant } from "rebar-ui";
import type { FloatAssistantVoiceOption } from "rebar-ui";

const DEMO_VOICES: FloatAssistantVoiceOption[] = [
  { id: "alquin", label: "Alquin", cloudVoiceId: "qwen-voice-alquin" },
  { id: "nova", label: "Nova", cloudVoiceId: "qwen-voice-nova" },
  { id: "onyx", label: "Onyx", cloudVoiceId: "qwen-voice-onyx" },
  { id: "browser-default", label: "Browser Default", browserVoiceName: "Google US English" },
];

// Handler props (onAttachmentPress, onSlashCommand, etc.) are real functions, which can't cross
// the server/client boundary as inline props on a Server Component page — this file exists purely
// to be the client boundary that owns them, same reason PersonaShowcase.tsx is its own "use client"
// file rather than inlined into page.tsx.
export function FloatAssistantDemo() {
  return (
    <FloatAssistant
      name="Rebar Demo"
      greeting="Hi! I'm a demo assistant. Try dragging me around, or minimize me to a dot!"
      position="bottom-right"
      voiceEnabled={true}
      draggable={true}
      minimizable={true}
      voices={DEMO_VOICES}
      voiceId="alquin"
      persona="chorus"
      theme="dark"
      sidebarDockable
      onAttachmentPress={() => {}}
      onSlashCommand={() => {}}
      onHistoryPress={() => {}}
      modelLabel="Chorus"
    />
  );
}
