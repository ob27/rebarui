import { Heading, Stack, Text, AssistantOrb } from "rebar-ui";
import type { Construct } from "@rebar-ui/placement";
import componentProps from "@/generated/component-props.json";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PersonaShowcase } from "./PersonaShowcase";
import { FloatAssistantDemo } from "./FloatAssistantDemo";

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
  persona?: "spark" | "strato" | "chorus",
  voiceEnabled?: boolean,
  draggable?: boolean,
  minimizable?: boolean,
  edgeDockable?: boolean,
  sidebarWidth?: number,
  dockMode?: "floating" | "sidebar",
  apiEndpoint?: string,
  apiAuthToken?: string,
  // Opinion-tier live bindings — see "API Integration" below
  source?: string,
  onSendMessage?: string,
  onVoiceRecord?: string,
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
      {
        kind: "text",
        text: "**Orb personas** — set `persona` to one of Spark, Strato, or Chorus (see the Personas section above) for a WebGL-shader orb that reacts to the assistant's own interaction state, instead of the default lightweight 2D-canvas animation. Only the trigger button uses the orb; chat message avatars and the typing indicator use a static icon, since animating a full shader per message was distracting and wasteful compute for repeated small instances.",
      },
      {
        kind: "text",
        text: "**Edge-dock to a full-height sidebar** — set `edgeDockable` and try dragging this demo's own trigger toward the right edge of the screen: a narrow rail peeks into view, and holding there (or dragging deeper) widens it into a drop target. Releasing inside the widened rail flies the trigger into a full-height sidebar instead of the default floating panel, with a Claude-Code-style input toolbar (attachment, slash-command, history, an optional model pill, and submit). A dock-toggle button also appears in the panel header for the same effect without the drag gesture. Off by default — every existing floating-panel behavior is unchanged unless this is set.",
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

      {/* Live demo — orb in glass lens container */}
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          margin: "2rem 0",
        }}
      >
        {/* Orb sits behind the glass */}
        <div
          style={{
            position: "absolute",
            inset: 6,
            borderRadius: "50%",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <AssistantOrb persona="chorus" state="idle" size={160} />
        </div>

        {/* Glass lens container - convex effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 40%, transparent 60%, rgba(0,0,0,0.1) 100%)",
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.4),
              0 2px 8px rgba(0,0,0,0.2),
              inset 0 2px 4px rgba(255,255,255,0.3),
              inset 0 -2px 4px rgba(0,0,0,0.2),
              0 0 0 1px rgba(255,255,255,0.15)
            `,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Top highlight - lens reflection */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "15%",
            width: "45%",
            height: "25%",
            borderRadius: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
            filter: "blur(2px)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Bottom rim light */}
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "20%",
            width: "60%",
            height: "15%",
            borderRadius: "50%",
            background: "linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
            filter: "blur(1px)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Full FloatAssistant — renders fixed in the bottom-right corner. Its own file (rather than
          inlined here) because it needs real function props (onAttachmentPress etc.), which can't
          cross the server/client boundary as literal props on this Server Component page — same
          reason PersonaShowcase below is its own "use client" file. */}
      <FloatAssistantDemo />

      <Stack gap="sm">
        <Heading level={2}>Personas</Heading>
        <Text color="secondary">
          Set <code>persona</code> to swap the trigger button&rsquo;s orb for one of the tuned WebGL
          shaders from <code>/dev/orb-comparison</code> — Spark and Strato are the raymarched
          &ldquo;Solid Orb&rdquo; hollow shell, Chorus is the metaball-based &ldquo;Flow Orb&rdquo;.
          Each persona defines an Idle and a Thinking state (Spark/Strato also define Listening/
          Speaking); the trigger interpolates between them automatically as the assistant&rsquo;s own
          interaction state changes. Toggle below to see it live.
        </Text>
        <PersonaShowcase />
      </Stack>

      <NextBlockRenderer blocks={BLOCKS} />
    </Stack>
  );
}
