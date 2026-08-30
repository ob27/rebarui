import type { Block } from "@rebar-ui/placement";

export const blocks: Block[] = [
  {
    type: "tabs",
    tabs: [
      {
        label: "Team",
        blocks: [
          {
            type: "table",
            columns: ["Team", "Open positions", "Lead"],
            rows: [
              { cells: ["Engineering", "4", "Priya Shah"], actionLabel: "Select" },
              { cells: ["Design", "2", "Marcus Webb"], actionLabel: "Select" },
              { cells: ["Sales", "6", "Elena Torres"], actionLabel: "Select" },
            ],
          },
        ],
      },
      {
        label: "Details",
        blocks: [
          {
            type: "form",
            fields: [
              { kind: "text", label: "Full name" },
              { kind: "date", label: "Start date" },
              {
                kind: "select",
                label: "Role",
                options: ["Individual Contributor", "Team Lead", "Manager"],
              },
            ],
          },
        ],
      },
      {
        label: "Review",
        blocks: [
          {
            type: "callout",
            tone: "info",
            title: "Ready to submit",
            subtitle: "Review your details above.",
          },
          {
            type: "modal",
            title: "Confirm onboarding",
            confirmLabel: "Confirm",
            cancelLabel: "Cancel",
            blocks: [
              {
                type: "callout",
                tone: "warning",
                title: "Are you sure?",
                subtitle:
                  "This will onboard the selected employee to the selected team.",
              },
            ],
          },
        ],
      },
    ],
  },
];