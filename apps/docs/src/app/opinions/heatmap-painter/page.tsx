import { redirect } from "next/navigation";

// HeatmapPainter ships with SchematicHeatmap and is documented on that page; this route is kept so
// existing links still land somewhere.
export default function HeatmapPainterPage() {
  redirect("/opinions/schematic-heatmap#painter");
}
