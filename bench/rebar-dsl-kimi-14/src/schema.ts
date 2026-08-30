// The DSL contract a coding agent targets instead of writing JSX directly.
// Each Section "type" is a pre-built layout archetype the renderer already knows how to lay
// out internally — the agent picks an archetype and fills in content; it never decides
// row/column/gap/nesting itself.

export type IconName = "close" | "info" | "refresh" | "clock";
export type Tone = "info" | "warning" | "success" | "error";

export interface Action {
  label?: string;
  icon?: IconName;
}

export type Section =
  | { type: "banner"; tone: Tone; icon?: IconName; text: string; action?: Action }
  | { type: "checklist"; heading?: string; items: string[] }
  | { type: "callout"; tone: Tone; icon?: IconName; title: string; subtitle?: string };

export interface PanelHeader {
  title: string;
  action?: Action;
}

export interface PanelDocument {
  type: "panel";
  header?: PanelHeader;
  sections: Section[];
}
