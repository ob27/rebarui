import { Box, Carousel, Stack, Table, Text } from "rebar-ui";
import type { TableColumn } from "rebar-ui";

// ScatterChart/LineChart/StackedBarChart used to be one-off SVG helpers here — promoted into real
// rebar-ui components (packages/core/src/components/{ScatterChart,LineChart,StackedBarChart}.tsx)
// and imported directly from "rebar-ui" by the pages that use them, so this file only keeps the
// two helpers that aren't (yet) worth a real component of their own on their own merit: a thin
// StatsTable wrapper around the real Table component (below), and an image-gallery wrapper around
// Carousel.

/**
 * These are small, static, presentational summary tables — no sorting/selection/pagination
 * genuinely helps them, so this only exists to keep every existing `headers`/`rows` call site
 * unchanged while delegating to the real `Table` component underneath for its borders, sticky
 * header, and hover state, replacing what used to be bare `Box`-as-table markup here. Every page
 * that calls this is a plain Server Component (no "use client"), and `Table` crosses into client
 * territory via its own `Checkbox` import — so `columns`/`rowKey` deliberately avoid ever
 * constructing function values here (an `accessor` closure per column, a `rowKey` closure) that
 * would fail to serialize across that boundary; row objects instead carry plain, named properties
 * matching each column's own `key`, letting `Table`'s default `row[key]` lookup do the work, and
 * `rowKey` is a plain string.
 */
export function StatsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  const columns: TableColumn<Record<string, string | number>>[] = headers.map((header, colIndex) => ({
    key: String(colIndex),
    header,
  }));
  const data = rows.map((cells, index) => {
    const row: Record<string, string | number> = { __rowKey: index };
    cells.forEach((cell, colIndex) => {
      row[String(colIndex)] = cell;
    });
    return row;
  });
  return <Table columns={columns} data={data} rowKey="__rowKey" />;
}

export function Gallery({
  label,
  dir,
  prefix,
  count = 15,
}: {
  label: string;
  dir: string;
  prefix: string;
  count?: number;
}) {
  return (
    <Stack gap="xs">
      <Text size="sm" style={{ fontWeight: "var(--rebar-font-weight-semibold)" }}>
        {label}
      </Text>
      <Carousel aria-label={`${label} screenshots`}>
        {Array.from({ length: count }, (_, i) => {
          const n = String(i + 1).padStart(2, "0");
          return (
            <Box key={n} style={{ maxWidth: 360, margin: "0 auto" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${dir}/${prefix}-${n}.png`}
                alt={`${label}, run ${n}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          );
        })}
      </Carousel>
    </Stack>
  );
}
