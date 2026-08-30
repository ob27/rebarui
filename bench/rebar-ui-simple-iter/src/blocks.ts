import type { Block } from "@rebar-ui/placement";

export const blocks: Block[] = [
  {
    type: "callout",
    tone: "info",
    title: "Before you begin",
    subtitle: "Manage how we contact you and what updates you receive.",
  },
  {
    type: "form",
    heading: "Account Settings",
    fields: [
      {
        kind: "email",
        label: "Email address",
        placeholder: "you@example.com",
      },
      {
        kind: "text",
        label: "Display name",
        placeholder: "e.g. Jane Doe (shown on your public profile)",
      },
      {
        kind: "text",
        label: "Mobile phone number",
        placeholder: "e.g. (555) 123-4567",
      },
      {
        kind: "date",
        label: "Date of birth",
      },
      {
        kind: "checkbox",
        label: "Email me about product updates",
        checked: false,
      },
      {
        kind: "checkbox",
        label: "Email me about security alerts and login attempts",
        checked: false,
      },
      {
        kind: "checkbox",
        label: "Subscribe to the monthly newsletter",
        checked: false,
      },
      {
        kind: "checkbox",
        label: "Email me about new features",
        checked: false,
      },
      {
        kind: "checkbox",
        label: "Make my profile visible to other users",
        checked: false,
      },
      {
        kind: "textarea",
        label: "Any accessibility needs we should know about?",
      },
    ],
    submitLabel: "Save changes",
  },
  {
    type: "callout",
    tone: "warning",
    title: "Phone number required for security alerts",
    subtitle: "If you enable login attempt alerts, add a phone number so we can reach you.",
  },
  {
    type: "callout",
    tone: "success",
    title: "You're all set",
    subtitle: "Changes are saved automatically once you submit the form above.",
  },
];
