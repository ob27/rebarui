import type { CSSProperties } from "react";
import componentProps from "@/generated/component-props.json";
import { Text } from "rebar-ui";

interface PropRow {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string | null;
}

const PROPS: Record<string, PropRow[]> = componentProps;

/**
 * Generated from packages/core's actual TypeScript prop types (see
 * apps/docs/scripts/generate-props.mjs), not hand-maintained — per
 * ref/MARKETING_SITE.md, so this can't silently drift from the real component signature.
 */
export function PropsTable({ component }: { component: string }) {
  const rows = PROPS[component];

  if (!rows || rows.length === 0) {
    return (
      <Text size="sm" color="secondary">
        No component-specific props (only standard HTML/ARIA attributes, forwarded as-is).
      </Text>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "var(--rebar-font-size-sm, 14px)" }}>
        <thead>
          <tr>
            {["Prop", "Type", "Required", "Default"].map((heading) => (
              <th
                key={heading}
                style={{
                  textAlign: "left",
                  padding: "var(--rebar-space-sm, 8px)",
                  borderBottom: "2px solid var(--rebar-color-border-strong, #333)",
                }}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td style={cellStyle}>
                <code>{row.name}</code>
              </td>
              <td style={cellStyle}>
                <code>{row.type}</code>
              </td>
              <td style={cellStyle}>{row.required ? "Yes" : "No"}</td>
              <td style={cellStyle}>{row.defaultValue ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cellStyle: CSSProperties = {
  padding: "var(--rebar-space-sm, 8px)",
  borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)",
  verticalAlign: "top",
};
