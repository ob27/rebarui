"use client";

import { useState } from "react";
import { Avatar, Heading, Stack, Text, TopBar } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";
import { PhoneBar } from "@/components/PhoneBar";
import { TidelinePhone } from "@/app/imitations/device-frame/TidelinePhone";
import { PROFILE } from "@/fixtures/athic";

const CODE = `<Avatar fallback="MK" size="xl" overlay="edit" aria-label="Change photo" onClick={pickPhoto} loading={uploading} />
<Avatar fallback="MK" size="xl" badge={<CameraIcon />} />
<Avatar fallback="MK" size={72} invalid />`;

const CAM = (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  </svg>
);
const tint = { background: "var(--rebar-color-tint-1)" };

export function AvatarMobile() {
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);
  const pick = () => {
    setFailed(false);
    setUploading(true);
    setTimeout(() => setUploading(false), 1400);
  };
  return (
    <>
      <Heading level={2}>Upload overlay</Heading>
      <DemoStage
        title="Avatar with upload overlay"
        caption="Edit band, spinner while uploading, camera badge; click the photo"
        code={CODE}
        widths={false}
        states={[
          { label: "Overlay “Edit”", node: <Avatar fallback={PROFILE.initials} size="xl" overlay="edit" aria-label="Change photo" style={tint} /> },
          { label: "Uploading", node: <Avatar fallback={PROFILE.initials} size="xl" overlay="edit" loading aria-label="Uploading photo" style={tint} /> },
          { label: "Camera badge", node: <Avatar fallback={PROFILE.initials} size="xl" badge={CAM} style={tint} /> },
          { label: "Sizes (56, 72)", node: <Stack direction="row" gap="sm" align="center"><Avatar fallback={PROFILE.initials} size={56} style={tint} /><Avatar fallback={PROFILE.initials} size={72} style={tint} /></Stack> },
          { label: "Upload failed", node: <Stack gap="xs"><Avatar fallback={PROFILE.initials} size="xl" invalid style={tint} /><Text size="sm" style={{ color: "var(--rebar-color-danger)" }}>Try a smaller photo</Text></Stack> },
        ]}
      >
        <Stack direction="row" gap="xl" align="center" justify="center">
          <Avatar fallback={PROFILE.initials} size="xl" overlay="edit" aria-label="Change photo" loading={uploading} onClick={pick} style={tint} />
          <Text color="secondary">{uploading ? "Uploading…" : "Tap the photo to change it."}</Text>
        </Stack>
      </DemoStage>
      <DemoStage title="Your Details" caption="In context: uploading, then updated" widths={false}>
        <Stack direction="row" gap="lg" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <TidelinePhone width={320} height={340} bar={<PhoneBar><TopBar leading="back" title="Your Details" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Text variant="eyebrow">Profile</Text>
              <div style={{ background: "var(--rebar-color-tint-3)", borderRadius: 22, padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar fallback={PROFILE.initials} size={72} loading style={tint} aria-label="Uploading photo" />
                <div><Text size="xs" color="secondary">Username</Text><b>{PROFILE.username.slice(1)}</b></div>
              </div>
            </div>
          </TidelinePhone>
          <TidelinePhone width={320} height={340} bar={<PhoneBar><TopBar leading="back" title="Your Details" /></PhoneBar>}>
            <div style={{ display: "grid", gap: 14 }}>
              <Text variant="eyebrow">Profile</Text>
              <div style={{ background: "var(--rebar-color-tint-3)", borderRadius: 22, padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar fallback={PROFILE.initials} size={72} overlay="edit" aria-label="Change photo" onClick={() => setFailed((f) => !f)} invalid={failed} style={tint} />
                <div><Text size="xs" color="secondary">Username</Text><b>{PROFILE.username.slice(1)}</b></div>
              </div>
              <Text size="sm" color="secondary">{failed ? "Try a smaller photo." : "Tap the photo to change it."}</Text>
            </div>
          </TidelinePhone>
        </Stack>
      </DemoStage>
    </>
  );
}
