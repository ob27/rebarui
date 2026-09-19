import { Heading, Stack, Text } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";

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
  qwenTtsApiKey?: string,
  qwenSttApiKey?: string,
  qwenLlmApiKey?: string,
  openKnowledgeApiKey?: string,
  knowledgeBaseId?: string,
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
        text: "The FloatAssistant accepts API keys for multiple services:",
      },
      {
        kind: "list",
        items: [
          "**qwenLlmApiKey** — Qwen text LLM API key for text-based conversations",
          "**qwenTtsApiKey** — Qwen text-to-speech API key for voice output",
          "**qwenSttApiKey** — Qwen speech-to-text API key for voice input",
          "**openKnowledgeApiKey** — OpenKnowledge (Rebar Super) service API key",
          "**knowledgeBaseId** — ID of the knowledge base to query in OpenKnowledge",
        ],
      },
      {
        kind: "text",
        text: "API keys are hashed client-side before transmission for security. The OpenKnowledge service (Rebar Super) provides a unified interface for querying multiple knowledge bases.",
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
        text: "**Minimize to dot** — Click the minimize button (or double-click the assistant) to collapse it to a 15×15px dot in the bottom-right corner. Click the dot to expand again.",
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
        and API integration for Qwen LLM, Qwen TTS/STT, and OpenKnowledge (Rebar Super). The
        assistant is 100% transparent about being an AI — it never pretends to be human.
      </Text>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
