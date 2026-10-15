/**
 * Constructs added in the current release line (0.12.x), shown with a "new" tag in the catalogue and on their reference pages.
 * Prune this at each release, so "new" keeps meaning something.
 */
export const NEW_CONSTRUCTS: ReadonlySet<string> = new Set([
  "Puppet",
  "SchematicHeatmap",
  "HeatmapPainter",
  "HeatmapViewer",
  "AgentTile",
  "AgentWall",
  "BackdropSection",
  "BentoGrid",
  "BentoCard",
  "DeviceFrame",
  "DeviceStage",
  "FloatCard",
  "FeatureShowcase",
  "ScrollRail",
  "EmailCapture",
]);
