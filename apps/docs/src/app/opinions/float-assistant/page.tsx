import { Heading, Stack, Text, FloatAssistant } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import type { FloatAssistantVoiceOption } from "rebar-ui";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

const DEMO_VOICES: FloatAssistantVoiceOption[] = [
  { id: "alquin", label: "Alquin", browserVoiceName: "Google UK English Male" },
  { id: "nova", label: "Nova", browserVoiceName: "Google US English" },
  { id: "onyx", label: "Onyx", browserVoiceName: "Google UK English Female" },
];

const BLOCKS: Construct[] = [
  {
    type: "doc-section",
    heading: "Overview",
    body: [
      {
        kind: "text",
        text: "A floating AI assistant button that expands into a chat/voice interface. Features dynamic orb animations, drag-to-move with physics, minimize to a 15×15px dot, and transparent AI interaction design. Supports text and voice input modes, with API integration for Qwen LLM, Qwen TTS/STT, and the OpenKnowledge (Rebar Super) service.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [
      {
        kind: "code",
        code: `{
  type: "float-assistant",
  name?: string,
  greeting?: string,
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left",
  accentColor?: string,
  voiceEnabled?: boolean,
  draggable?: boolean,
  minimizable?: boolean,
  apiEndpoint?: string,
  apiAuthToken?: string,
}`,
      },
    ],
  },
  { type: "props-table", heading: "Props", rows: componentProps["FloatAssistant"] ?? [] },
  {
    type: "doc-section",
    heading: "API Integration",
    body: [
      {
        kind: "text",
        text: "The FloatAssistant uses a **server-side proxy pattern** for security. The app developer implements an API endpoint that holds API keys securely server-side. The construct never sees real API keys.",
      },
      {
        kind: "text",
        text: "**Endpoint contract:**",
      },
      {
        kind: "code",
        code: `POST /api/assistant/chat
Content-Type: application/json
Authorization: Bearer <session-token>

{
  "message": "What is the weather?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}

Response:
{
  "reply": "I don't have access to weather data, but..."
}`,
      },
      {
        kind: "text",
        text: "The server endpoint then calls Qwen LLM, OpenKnowledge, or any other service with the real API keys stored in environment variables.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Features",
    body: [
      {
        kind: "text",
        text: "**Drag with physics** — Click and drag the button to move it anywhere on screen. When released with momentum, it continues moving with friction until it stops.",
      },
      {
        kind: "text",
        text: "**Minimize to dot** — Click the minimize button to collapse to a 15×15px dot in the bottom-right corner. Click the dot to expand again.",
      },
      {
        kind: "text",
        text: "**Voice mode** — Toggle between text and voice input. In voice mode, click the microphone to start recording. Visual wave animation shows recording activity.",
      },
      {
        kind: "text",
        text: "**Transparent AI** — The footer disclaimer reminds users that AI can make mistakes. The assistant never pretends to be human.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      {
        kind: "text",
        text: "Real `role=\"dialog\"` when expanded, proper `aria-label` and `aria-expanded` states, keyboard-navigable controls, and visible focus indicators. The floating button is always reachable via Tab.",
      },
    ],
  },
  {
    type: "doc-section",
    heading: "data-rebar-* attributes",
    body: [
      {
        kind: "text",
        text: '`data-rebar-component="float-assistant"`, `data-rebar-part="trigger"` on the button, `data-rebar-part="panel"` on the expanded panel, `data-rebar-part="messages"` on the message list.',
      },
    ],
  },
];

export default function FloatAssistantPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>FloatAssistant</Heading>
      <Text color="secondary">
        A floating AI assistant with drag-to-move physics, minimize-to-dot, voice and text modes,
        and server-side API proxy integration. The assistant is 100% transparent about being an AI
        — it never pretends to be human.
      </Text>

      {/* Live demo — the assistant appears in the bottom-right corner */}
      <FloatAssistant
        name="Rebar Demo"
        greeting="Hi! I'm a demo assistant. Try dragging me around, or minimize me to a dot!"
        position="bottom-right"
        voiceEnabled={true}
        draggable={true}
        minimizable={true}
        voices={DEMO_VOICES}
        voiceId="alquin"
      />

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
