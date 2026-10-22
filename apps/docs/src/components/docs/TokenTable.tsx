import { Box, Heading, Stack, Text } from "rebar-ui";
import tokens from "@/generated/component-tokens.json";
import { TOKENS_ADDED_1_1 } from "@/data/tokensAdded";

type TokenRow = { name: string; defaultValue: string | null };
const TOKENS = tokens as Record<string, TokenRow[]>;

const CELL = { padding: "var(--rebar-space-sm, 8px)", verticalAlign: "top" } as const;

/**
 * A construct's public `--rebar-*` custom properties with the default each one falls back to. The rows come from the stylesheet
 * (`scripts/generate-tokens.mjs`, run with the props generator), so the table cannot drift from the CSS; the "1.1" mark comes from
 * `TOKENS_ADDED_1_1`. Set a token on the component or any ancestor. Renders nothing for a component with no tokens.
 */
export function TokenTable({ component, heading = "Tokens" }: { component: string; heading?: string }) {
  const rows = TOKENS[component] ?? [];
  if (rows.length === 0) return null;
  const added = rows.filter((r) => TOKENS_ADDED_1_1.has(r.name)).length;
  return (
    <Stack gap="sm" data-rebar-docs="token-table" id="tokens">
      <Heading level={2}>{heading}</Heading>
      <Text size="sm" color="secondary">
        Custom properties, set on the component or any ancestor. The default is what applies when one is unset.
        {added > 0 ? ` ${added} of ${rows.length} were added in 1.1.0 and are marked.` : ""}
      </Text>
      <Box style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "var(--rebar-font-size-sm, 14px)" }}>
          <thead>
            <tr>
              {["Property", "Default", ""].map((h, i) => (
                <th key={i} style={{ ...CELL, textAlign: "left", borderBottom: "2px solid var(--rebar-color-border-strong, #333)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} style={{ borderBottom: "1px solid var(--rebar-color-border, #e0e0e0)" }}>
                <td style={CELL}><code>{r.name}</code></td>
                <td style={{ ...CELL, overflowWrap: "anywhere" }}>{r.defaultValue ? <code>{r.defaultValue}</code> : <span style={{ color: "var(--rebar-color-text-secondary)" }}>unset</span>}</td>
                <td style={{ ...CELL, whiteSpace: "nowrap", color: "var(--rebar-color-text-secondary)" }}>{TOKENS_ADDED_1_1.has(r.name) ? "1.1" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Stack>
  );
}
