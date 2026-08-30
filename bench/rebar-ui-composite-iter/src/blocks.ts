import type { Block } from "@rebar-ui/placement";

export const blocks: Block[] = [
  {
    type: "callout",
    tone: "info",
    title: "Heads up",
    subtitle: "Archived projects are read-only.",
  },
  {
    type: "filter-bar",
    searchPlaceholder: "Search projects…",
    filterLabel: "Status",
    filterOptions: ["All", "Active", "Archived", "Draft"],
    actionLabel: "New Project",
  },
  {
    type: "data-list",
    items: [
      { title: "Marketing Site Redesign", badge: "Active" },
      { title: "Q3 Budget Review", badge: "Active" },
      { title: "Customer Portal Beta", badge: "Active" },
      { title: "Vendor Onboarding Flow", badge: "Draft" },
      { title: "Internal Tools Revamp", badge: "In Progress" },
      { title: "Analytics Dashboard Overhaul", badge: "Active" },
      { title: "Legacy API Migration", badge: "Archived" },
      { title: "Mobile App Push Notifications", badge: "Draft" },
    ],
  },
  {
    type: "callout",
    tone: "success",
    title: "All synced",
    subtitle: "Project list is up to date as of a few seconds ago.",
  },
  {
    type: "callout",
    tone: "warning",
    title: "Draft projects expire soon",
    subtitle: "Drafts older than 30 days are automatically deleted.",
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
          { kind: "text", label: "Owner", placeholder: "Optional" },
          { kind: "textarea", label: "Description", placeholder: "Optional" },
        ],
      },
    ],
  },
];
