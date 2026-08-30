import type { PanelDocument } from "./schema";

export const panel: PanelDocument = {
  type: "panel",
  header: {
    title: "Preview",
    action: { icon: "close" },
  },
  sections: [
    {
      type: "banner",
      tone: "info",
      icon: "info",
      text: "Preview — nothing entered here is saved",
      action: { label: "Reset", icon: "refresh" },
    },
    {
      type: "checklist",
      heading: "Checklist",
      items: [
        "Pre-Fab Checkprint comments resolved",
        "Pre-Fab Attribute Matrix comments resolved",
        "Pre-Fab Data Release form comments resolved",
        "As Built model data supplied by DE",
        "No blocking quality items",
        "All anticipated Post-fab decisions documented",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      icon: "clock",
      title: "DPK can now move to Post-fab In Progress",
      subtitle: "Some required items in this section are still incomplete.",
    },
  ],
};