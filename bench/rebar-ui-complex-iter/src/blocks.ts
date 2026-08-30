import type { Block } from "@rebar-ui/placement";

export const blocks: Block[] = [
  {
    type: "tabs",
    tabs: [
      {
        label: "Team",
        blocks: [
          {
            type: "callout",
            tone: "info",
            title: "Before you assign a team",
            subtitle: "Each team can only be assigned once per onboarding.",
          },
          {
            type: "table",
            columns: ["Team", "Open positions", "Lead"],
            rows: [
              { cells: ["Engineering", "4 (2 backend, 2 frontend)", "Priya Shah"], actionLabel: "Select" },
              { cells: ["Design", "2", "Marcus Webb"], actionLabel: "Select" },
              { cells: ["Sales", "6 (4 AE, 2 SDR)", "Elena Torres"], actionLabel: "Select" },
              { cells: ["Support", "3", "Diego Fernandez"], actionLabel: "Select" },
              { cells: ["Marketing", "1", "Ava Chen"], actionLabel: "Select" },
              { cells: ["Legal", "1", "Naomi Klein"], actionLabel: "Select" },
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
                subtitle: "This will onboard the selected employee to the selected team.",
              },
            ],
          },
        ],
      },
      {
        label: "Details",
        blocks: [
          {
            type: "callout",
            tone: "info",
            title: "Double-check the details",
            subtitle: "These fields will be used to create the employee's record.",
          },
          {
            type: "form",
            fields: [
              { kind: "text", label: "Full name" },
              { kind: "date", label: "Start date" },
              {
                kind: "select",
                label: "Role",
                options: ["Individual Contributor", "Team Lead", "Manager", "Contractor"],
              },
              {
                kind: "select",
                label: "Team",
                options: ["Engineering", "Design", "Sales"],
              },
              { kind: "text", label: "Work email" },
            ],
          },
        ],
      },
    ],
  },
];
