"use client";

import { useMemo, useState } from "react";
import { Empty, FilterBar, Heading, Stack, Text } from "rebar-ui";
import componentProps from "@/generated/component-props.json";
import { PerspectiveGrid } from "@/fixtures/AthicBits";
import { PERSPECTIVES, PERSPECTIVE_CATEGORIES, PERSPECTIVE_SORT } from "@/fixtures/athic";
import type { Construct } from "@rebar-ui/placement";
import { DemoStage } from "@/components/DemoStage";
import { NextBlockRenderer } from "@/components/NextBlockRenderer";
import { PROJECTS } from "@/fixtures/tideline";

const CODE = `{ type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }`;

const PILL_CODE = `<FilterBar
  searchPlaceholder="Search Perspectives…"
  searchValue={q} onSearchChange={setQ}
  options={categories} value={cat} onValueChange={setCat} filterLabel="Category"
  sortOptions={sorts} sortValue={sort} onSortChange={setSort}
  count={results.length} noun="Perspective" onClear={() => { setQ(""); setCat("all"); }}
/>
{results.length === 0 ? <Empty description="No Perspectives match." /> : <Grid items={results} />}`;

function PerspectivesDemo({ narrow = false }: { narrow?: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("newest");
  const results = useMemo(() => {
    const found = PERSPECTIVES.filter((p) => (cat === "all" || p.category === cat) && (q === "" || `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase())));
    return [...found].sort((a, b) => (sort === "shortest" ? a.readMinutes - b.readMinutes : sort === "oldest" ? PERSPECTIVES.indexOf(b) - PERSPECTIVES.indexOf(a) : 0));
  }, [q, cat, sort]);
  return (
    <Stack gap="md">
      <FilterBar
        searchPlaceholder="Search Perspectives…"
        searchValue={q}
        onSearchChange={setQ}
        options={PERSPECTIVE_CATEGORIES}
        value={cat}
        onValueChange={setCat}
        filterLabel="Category"
        scrollPills={narrow}
        sortOptions={PERSPECTIVE_SORT}
        defaultSortValue="newest"
        onSortChange={setSort}
        count={results.length}
        noun="Perspective"
        onClear={() => {
          setQ("");
          setCat("all");
        }}
      />
      {results.length === 0 ? <Empty description={`No Perspectives match \u201c${q}\u201d. Try a shorter word, or clear the filters.`} /> : <PerspectiveGrid items={results} />}
    </Stack>
  );
}

const SHAPE: Construct[] = [
  { type: "props-table", heading: "FilterBar props", rows: componentProps["FilterBar"] ?? [] },
  { type: "props-table", heading: "FilterPills props", rows: componentProps["FilterPills"] ?? [] },
  { type: "props-table", heading: "ResultCount props", rows: componentProps["ResultCount"] ?? [] },
  {
    type: "doc-section",
    heading: "Search, filter, sort and count",
    body: [
      { kind: "text", text: "`FilterBar` is the component behind the block's new fields: a pill search field (Escape or the clear button empties it), single-select `FilterPills` with an optional count each, a pill-shaped sort `Select` with a muted label, and a `ResultCount` live region (\"9 Perspectives in Ethics\") with a Clear filters button. Every value is controlled or uncontrolled. When the count is 0 render an `Empty` in place of the grid." },
      { kind: "text", text: "The filter-bar block turns on this look when it has `pills`, `sortOptions` or `resultCount`. Otherwise it stays the plain search, select and button row." },
      { kind: "code", code: `{ type: "filter-bar", searchPlaceholder: "Search Perspectives…", pills: ["All", "Ethics", "Grace"], sortOptions: ["Newest", "Oldest"], resultCount: { count: 24, noun: "Perspective" } }` },
    ],
  },
  {
    type: "doc-section",
    heading: "Accessibility",
    body: [
      { kind: "text", text: "The search is a real `type=\"search\"` input named by `searchLabel`. The pills are a named group of toggle buttons (`aria-pressed`), 44px tall. The count is `role=\"status\"` (polite), so a screen reader hears the new total after each change. On a phone `scrollPills` keeps the pills on one line and scrolls them sideways." },
    ],
  },
  {
    type: "doc-section",
    heading: "Shape",
    body: [{ kind: "code", code: `{ type: "filter-bar", searchPlaceholder?: string, filterLabel?: string, filterOptions?: string[], actionLabel?: string, pills?: string[], sortOptions?: string[], sortLabel?: string, resultCount?: { count: number, noun?: string, plural?: string } }` }],
  },
];

export default function FilterBarPage() {
  return (
    <Stack gap="lg">
      <Heading level={1}>Filter Bar</Heading>
      <Text color="secondary">A search input, an optional filter select and a primary action in one row.</Text>

      <DemoStage
        title="Project filters"
        caption="Search, status filter and a New project button"
        code={CODE}
        states={[
          { label: "Search only", node: <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search files…" }]} /> },
          { label: "With filter", node: <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search tasks…", filterLabel: "Tag", filterOptions: ["All", "Design", "Eng", "Research", "Ops"] }]} /> },
          { label: "Action only", node: <NextBlockRenderer blocks={[{ type: "filter-bar", actionLabel: "Add task" }]} /> },
        ]}
      >
        <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }]} />
      </DemoStage>

      <Heading level={2}>In context</Heading>
      <DemoStage title="Projects page" caption="Above the project list" widths={false}>
        <Stack gap="md">
          <Heading level={3}>Projects</Heading>
          <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search projects…", filterOptions: ["All", "On track", "Review", "Late", "Done"], actionLabel: "New project" }]} />
          <NextBlockRenderer blocks={[{ type: "data-list", items: PROJECTS.map((p) => ({ title: p.name, badge: p.status })) }]} />
        </Stack>
      </DemoStage>

      <Heading level={2}>Search and filter bar</Heading>
      <DemoStage title="Perspectives gallery" caption="Type, pick a category, change the sort: the count and the grid follow" code={PILL_CODE} states={[
        { label: "Block, with pills and count", node: <NextBlockRenderer blocks={[{ type: "filter-bar", searchPlaceholder: "Search Perspectives…", pills: ["All", "Ethics", "Grace"], sortOptions: ["Newest", "Oldest"], resultCount: { count: 24, noun: "Perspective" } }]} /> },
        { label: "Pills only", node: <FilterBar options={PERSPECTIVE_CATEGORIES} filterLabel="Category" /> },
      ]}>
        <PerspectivesDemo />
      </DemoStage>
      <DemoStage title="On a phone" caption="Pills scroll sideways; every target is 44px or more" defaultWidth="phone" widths>
        <PerspectivesDemo narrow />
      </DemoStage>

      <NextBlockRenderer blocks={SHAPE} />
    </Stack>
  );
}
