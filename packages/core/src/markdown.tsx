import type { ElementType, ReactNode } from "react";
import { renderBionicChildren } from "./bionic";
import type { BionicOptions } from "./bionic";
// Circular with CodeBlock.tsx (CodeBlock imports `renderMarkdown` from here for its own
// `markdown` toggle; this file imports `CodeBlock` back, to render a fenced code block for real —
// copy button and language label included — instead of a bare `<pre><code>`). Safe: neither side
// touches the other's export at module-evaluation time, only inside a function body called later,
// which is the standard "two components that can nest inside each other" circular-import shape.
import { CodeBlock } from "./components/CodeBlock";

/**
 * A small, real Markdown-to-React renderer — used by `CodeBlock`'s own `markdown` toggle and by
 * `ChatThread`'s message content (real LLM responses, Claude/Qwen included, default to Markdown
 * prose) and by `Prose`/`Markdown` (marketing and legal pages) — headings, paragraphs, ordered/unordered
 * lists, blockquotes (a final `— Name` line becomes a `<cite>`), horizontal rules, pipe tables, fenced code blocks (real
 * `CodeBlock`s, not bare `<pre>`, so an embedded snippet gets the same copy button and language
 * label a hand-authored one would), and inline bold/italic/code/links. Raw HTML is never passed
 * through (React escapes it) and `javascript:`/`data:` link targets render as plain text. Deliberately
 * not a full CommonMark implementation (no nested blockquotes/lists) — the
 * same "the real shape, not exhaustive edge-case coverage" philosophy `CodeBlock`'s own doc
 * comment already states for skipping syntax highlighting. Reach for a real markdown library if a
 * caller's content needs more than this covers.
 */

const INLINE_MARKUP = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g;

export interface RenderMarkdownOptions {
  /** Applies bionic-reading formatting to plain-text runs (never inside `<strong>`/`<code>`/`<a>`
   * spans) — same convention as `useBionicChildren` elsewhere, just threaded through per inline
   * run instead of the whole content at once, since a markdown document's content isn't one flat
   * string. Off by default (matches `CodeBlock`'s own pre-existing behavior for its `markdown`
   * toggle, unchanged unless a caller opts in). */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
  /** Render a node type with your own component, e.g. `{ a: RouterLink }`. The component receives
   * the same props the plain element would (`href` and `children` for `a`). */
  components?: MarkdownComponents;
}

export type MarkdownTag =
  | "a" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "ul" | "ol" | "li" | "blockquote" | "cite"
  | "hr" | "table" | "thead" | "tbody" | "tr" | "th" | "td" | "strong" | "em" | "code";
export type MarkdownComponents = Partial<Record<MarkdownTag, ElementType>>;

const UNSAFE_PROTOCOL = /^\s*(?:javascript|data|vbscript):/i;
/** True when a link target is safe to put in an `href`. */
function isSafeHref(href: string): boolean {
  return !UNSAFE_PROTOCOL.test(href);
}

function renderInline(text: string, keyPrefix: string, options?: RenderMarkdownOptions): ReactNode[] {
  const C = (tag: MarkdownTag): ElementType => options?.components?.[tag] ?? tag;
  const Strong = C("strong");
  const Code = C("code");
  const Anchor = C("a");
  const Em = C("em");
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  INLINE_MARKUP.lastIndex = 0;
  while ((match = INLINE_MARKUP.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(<Strong key={`${keyPrefix}-${key++}`}>{match[1]}</Strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<Code key={`${keyPrefix}-${key++}`}>{match[2]}</Code>);
    } else if (match[3] !== undefined) {
      if (isSafeHref(match[4] ?? "")) {
        nodes.push(
          <Anchor key={`${keyPrefix}-${key++}`} href={match[4]}>
            {match[3]}
          </Anchor>,
        );
      } else {
        nodes.push(match[3]);
      }
    } else if (match[5] !== undefined) {
      nodes.push(<Em key={`${keyPrefix}-${key++}`}>{match[5]}</Em>);
    }
    lastIndex = INLINE_MARKUP.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return renderBionicChildren(nodes, options?.bionic ?? false, options?.bionicOptions) as ReactNode[];
}

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const ORDERED_ITEM_RE = /^\s*\d+\.\s+(.*)$/;
const UNORDERED_ITEM_RE = /^\s*[-*]\s+(.*)$/;
const BLOCKQUOTE_RE = /^>\s?(.*)$/;
const FENCE_RE = /^```(\w*)/;
const RULE_RE = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const TABLE_ROW_RE = /^\s*\|.*\|\s*$/;
const TABLE_RULE_RE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const CITE_RE = /^(?:\u2014|--)\s+(.+)$/;

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

export function renderMarkdown(source: string, options?: RenderMarkdownOptions): ReactNode {
  const C = (tag: MarkdownTag): ElementType => options?.components?.[tag] ?? tag;
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (FENCE_RE.test(line)) {
      const language = FENCE_RE.exec(line)?.[1] || undefined;
      const fenceLines: string[] = [];
      i++;
      while (i < lines.length && !FENCE_RE.test(lines[i] ?? "")) {
        fenceLines.push(lines[i] ?? "");
        i++;
      }
      i++; // skip closing fence
      blocks.push(
        <CodeBlock key={blockKey++} className="rebar-markdown-code" code={fenceLines.join("\n")} language={language} />,
      );
      continue;
    }

    const heading = HEADING_RE.exec(line);
    if (heading) {
      const level = heading[1]!.length;
      const HeadingTag = C(`h${Math.min(level, 6)}` as MarkdownTag);
      blocks.push(
        <HeadingTag key={blockKey++} className="rebar-markdown-heading">
          {renderInline(heading[2] ?? "", `h${blockKey}`, options)}
        </HeadingTag>,
      );
      i++;
      continue;
    }

    if (RULE_RE.test(line)) {
      const Rule = C("hr");
      blocks.push(<Rule key={blockKey++} className="rebar-markdown-rule" />);
      i++;
      continue;
    }

    if (TABLE_ROW_RE.test(line) && TABLE_RULE_RE.test(lines[i + 1] ?? "") && (lines[i + 1] ?? "").includes("-")) {
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1] ?? "").map((cell) =>
        cell.startsWith(":") && cell.endsWith(":") ? "center" : cell.endsWith(":") ? "right" : undefined,
      );
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && TABLE_ROW_RE.test(lines[i] ?? "")) {
        rows.push(splitRow(lines[i] ?? ""));
        i++;
      }
      const Table = C("table");
      const THead = C("thead");
      const TBody = C("tbody");
      const Tr = C("tr");
      const Th = C("th");
      const Td = C("td");
      const key = blockKey++;
      blocks.push(
        <div key={key} className="rebar-markdown-table-wrap" data-rebar-part="table-wrap">
          <Table className="rebar-markdown-table">
            <THead>
              <Tr>
                {head.map((cell, c) => (
                  <Th key={c} scope="col" style={aligns[c] ? { textAlign: aligns[c] } : undefined}>
                    {renderInline(cell, `th${key}-${c}`, options)}
                  </Th>
                ))}
              </Tr>
            </THead>
            <TBody>
              {rows.map((row, r) => (
                <Tr key={r}>
                  {head.map((_, c) => (
                    <Td key={c} style={aligns[c] ? { textAlign: aligns[c] } : undefined}>
                      {renderInline(row[c] ?? "", `td${key}-${r}-${c}`, options)}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>,
      );
      continue;
    }

    if (BLOCKQUOTE_RE.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && BLOCKQUOTE_RE.test(lines[i] ?? "")) {
        quoteLines.push(BLOCKQUOTE_RE.exec(lines[i] ?? "")?.[1] ?? "");
        i++;
      }
      const Quote = C("blockquote");
      const Cite = C("cite");
      const citeMatch = quoteLines.length > 1 ? CITE_RE.exec(quoteLines[quoteLines.length - 1] ?? "") : null;
      const bodyLines = citeMatch ? quoteLines.slice(0, -1) : quoteLines;
      blocks.push(
        <Quote key={blockKey++} className="rebar-markdown-blockquote">
          {renderInline(bodyLines.join(" "), `q${blockKey}`, options)}
          {citeMatch ? <Cite>{renderInline(citeMatch[1] ?? "", `qc${blockKey}`, options)}</Cite> : null}
        </Quote>,
      );
      continue;
    }

    if (ORDERED_ITEM_RE.test(line) || UNORDERED_ITEM_RE.test(line)) {
      const ordered = ORDERED_ITEM_RE.test(line);
      const itemRe = ordered ? ORDERED_ITEM_RE : UNORDERED_ITEM_RE;
      const items: string[] = [];
      while (i < lines.length && itemRe.test(lines[i] ?? "")) {
        items.push(itemRe.exec(lines[i] ?? "")?.[1] ?? "");
        i++;
      }
      const ListTag = C(ordered ? "ol" : "ul");
      const Item = C("li");
      blocks.push(
        <ListTag key={blockKey++} className="rebar-markdown-list">
          {items.map((item, itemIndex) => (
            <Item key={itemIndex}>{renderInline(item, `li${blockKey}-${itemIndex}`, options)}</Item>
          ))}
        </ListTag>,
      );
      continue;
    }

    // Plain paragraph: consume consecutive non-blank, non-special lines as one block, joined with
    // a space (matching how a Markdown paragraph collapses soft line breaks).
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      (lines[i] ?? "").trim() !== "" &&
      !HEADING_RE.test(lines[i] ?? "") &&
      !FENCE_RE.test(lines[i] ?? "") &&
      !BLOCKQUOTE_RE.test(lines[i] ?? "") &&
      !ORDERED_ITEM_RE.test(lines[i] ?? "") &&
      !UNORDERED_ITEM_RE.test(lines[i] ?? "") &&
      !RULE_RE.test(lines[i] ?? "") &&
      !(TABLE_ROW_RE.test(lines[i] ?? "") && TABLE_RULE_RE.test(lines[i + 1] ?? ""))
    ) {
      paragraphLines.push(lines[i] ?? "");
      i++;
    }
    const Paragraph = C("p");
    blocks.push(
      <Paragraph key={blockKey++} className="rebar-markdown-paragraph">
        {renderInline(paragraphLines.join(" "), `p${blockKey}`, options)}
      </Paragraph>,
    );
  }

  return blocks;
}
