"use client";

import { BottomSheet, Button, Text } from "rebar-ui";
import { DemoStage } from "@/components/DemoStage";

const CODE = `<BottomSheet appearance="popup" titleStyle="heading" title="Delete account" style={{ "--rebar-popup-heading-color": "var(--rebar-color-danger)" }} ... />`;

export function PopupHeadingDemo() {
  return (
    <DemoStage title="--rebar-popup-heading-color" caption="A popup sheet with titleStyle=&quot;heading&quot;: the title colour is a token (default: the title colour)" widths={false} code={CODE}>
      <BottomSheet
        appearance="popup"
        titleStyle="heading"
        title="Delete account"
        trigger={<Button variant="secondary">Open the sheet</Button>}
        className="docs-popup-heading-danger"
      >
        <Text size="sm" color="secondary">The heading takes --rebar-popup-heading-color.</Text>
      </BottomSheet>
    </DemoStage>
  );
}
