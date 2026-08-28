"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
} from "rebar-ui";

const PHASES = [
  { label: "Phase 1 — core primitives (Box, Stack, Text, Heading, Button, Input, Card, Alert)", done: true },
  { label: "Phase 2 — composite components (Dialog, Tabs, Form)", done: false },
  { label: "Phase 3 — theming (sketch, clean, dark)", done: false },
  { label: "Phase 4 — DevTools panel", done: false },
  { label: "Phase 5 — migration tooling", done: false },
  { label: "Phase 6 — this site, for real", done: false },
];

export default function Home() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Box as="main" style={{ maxWidth: 720, margin: "0 auto", padding: "var(--rebar-space-xl)" }}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Heading level={1}>Rebar UI</Heading>
          <Text color="secondary">
            Headless-first, intentionally low-fidelity components — built to be re-skinned into a
            real design system later. This page is that library, dogfooded, live.
          </Text>
        </Stack>

        <Alert type="info" title="Work in progress">
          This is a running build, not a finished marketing site — see the checklist below for
          what&apos;s actually implemented right now.
        </Alert>

        <Card>
          <Stack gap="md">
            <Heading level={3}>Live component check</Heading>

            <Stack direction="row" gap="sm">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="destructive">Destructive</Button>
            </Stack>

            <Stack direction="row" gap="sm">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading>Loading</Button>
            </Stack>

            <label>
              <Stack gap="xs">
                <Text as="span" size="sm">
                  Name
                </Text>
                <Input
                  placeholder="Type something"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Stack>
            </label>

            <Stack direction="row" gap="sm">
              <Button
                variant="primary"
                onClick={() => setSubmitted(true)}
                disabled={name.length === 0}
              >
                Submit
              </Button>
              {submitted ? (
                <Text size="sm" color="secondary">
                  Submitted: {name}
                </Text>
              ) : null}
            </Stack>
          </Stack>
        </Card>

        <Stack gap="xs">
          <Heading level={2}>Build progress</Heading>
          {PHASES.map((phase) => (
            <Text key={phase.label} size="sm" color={phase.done ? "primary" : "secondary"}>
              {phase.done ? "✅" : "⬜"} {phase.label}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
