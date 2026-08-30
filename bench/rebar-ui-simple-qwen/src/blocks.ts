import type { Block } from "@rebar-ui/placement";

export const blocks: Block[] = [
  {
    type: "form",
    heading: "Account Settings",
    fields: [
      {
        kind: "text",
        label: "Display name",
        placeholder: "e.g. Jane Doe",
      },
      {
        kind: "email",
        label: "Email address",
        placeholder: "you@example.com",
      },
      {
        kind: "checkbox",
        label: "Email me about product updates",
      },
      {
        kind: "checkbox",
        label: "Email me about security alerts",
        checked: true,
      },
    ],
    submitLabel: "Save changes",
  },
];