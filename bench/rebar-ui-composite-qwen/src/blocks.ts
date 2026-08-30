import type { Block } from "@rebar-ui/placement";

export const blocks: Block[] = [
  {
    type: "filter-bar",
    searchPlaceholder: "Search projects…",
    filterLabel: "Status",
    filterOptions: ["All", "Active", "Archived"],
    actionLabel: "New Project",
  },
  {
    type: "data-list",
    items: [
      { title: "Marketing Site Redesign", badge: "Active" },
      { title: "Q3 Budget Review", badge: "Active" },
      { title: "Legacy API Migration", badge: "Archived" },
      { title: "Customer Portal Beta", badge: "Active" },
    ],
  },
  {
    type: "modal",
    title: "New Project",
    confirmLabel: "Create",
    cancelLabel: "Cancel",
    blocks: [
      {
        type: "form",
        fields: [
          { kind: "text", label: "Project name", placeholder: "Required" },
          { kind: "textarea", label: "Description", placeholder: "Optional" },
        ],
      },
    ],
  },
];