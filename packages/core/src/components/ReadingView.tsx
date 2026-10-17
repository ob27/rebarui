import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";

export interface ReadingVerse {
  num: number;
  text: ReactNode;
  /** Rendered under this verse's text and action pill, inside the verse row (an inline note composer, a cross-reference). */
  extra?: ReactNode;
}

/** What `renderVerse` receives besides the verse. */
export interface ReadingVerseContext {
  highlighted: boolean;
  noted: boolean;
  /** The verse's default content (text, action pill and `extra`), to wrap or extend. */
  content: ReactNode;
}

export interface ReadingViewProps extends Omit<ComponentPropsWithoutRef<"article">, "title"> {
  /** Numbered passage. Serif body, 1.7 line height. */
  verses?: ReadingVerse[];
  /** Heading, e.g. "Galatians 3". */
  title?: ReactNode;
  /** Kicker above the body, e.g. "First reading · Galatians 3:22-29". */
  citation?: ReactNode;
  /** Free text body for readings that are not verse-numbered. */
  children?: ReactNode;
  /** A verse, or an inclusive `[from, to]` range, to tint (search hit, deep link). */
  highlight?: number | [number, number];
  /** Per-verse action pill (for example "Add Note"). Omit for no pills. */
  onVerseAction?: (verse: ReadingVerse) => void;
  verseActionLabel?: string;
  /** Replaces what is inside each verse row after the number. The row keeps its number, highlight and noted marks. */
  renderVerse?: (verse: ReadingVerse, context: ReadingVerseContext) => ReactNode;
  /** Font of the verse text: `"serif"` (the theme's display face, default) or `"sans"`. */
  verseFont?: "sans" | "serif";
  /** Verses whose pill reads "Note added" (filled). */
  notedVerses?: number[];
  /** Slot above the text for the narration bar (`WaveformAudioPlayer`). */
  media?: ReactNode;
  /** Slot below the text: Reflect, Share, Discuss as small outlined pills. */
  actions?: ReactNode;
  /** Translation credit. */
  footer?: ReactNode;
  /** Skeleton lines instead of the text. */
  loading?: boolean;
  /** Shown instead of the text when there is no reading (a ReactNode). */
  empty?: ReactNode;
  /** Shown instead of the text, for example "Translation unavailable". */
  error?: ReactNode;
  /** Panel background. Default `tint-2`. */
  tone?: "tint-1" | "tint-2" | "tint-3" | "tint-4" | "plain";
}

function isHighlighted(num: number, highlight: ReadingViewProps["highlight"]): boolean {
  if (highlight === undefined) return false;
  return Array.isArray(highlight) ? num >= highlight[0] && num <= highlight[1] : num === highlight;
}

/**
 * A reading panel for Scripture chapters and Mass readings: optional narration bar on top, numbered
 * verses or free text, an actions row and a credit. Synthetic: a static composition of slots around
 * the text with no state machine (loading, empty and error are props, not internal state).
 */
export function ReadingView({
  verses,
  title,
  citation,
  children,
  highlight,
  onVerseAction,
  verseActionLabel = "Add Note",
  notedVerses = [],
  renderVerse,
  verseFont,
  media,
  actions,
  footer,
  loading,
  empty,
  error,
  tone = "tint-2",
  className,
  ...props
}: ReadingViewProps) {
  let body: ReactNode;
  if (error) {
    body = (
      <div className="rebar-reading-view-message" data-rebar-part="error" role="alert">
        {error}
      </div>
    );
  } else if (loading) {
    body = (
      <div className="rebar-reading-view-skeleton" data-rebar-part="loading" aria-busy="true" aria-label="Loading reading">
        {[92, 100, 70, 96, 100, 64].map((w, i) => (
          <span key={i} className="rebar-reading-view-line" style={{ width: `${w}%` }} />
        ))}
      </div>
    );
  } else if (empty && !verses?.length && !children) {
    body = (
      <div className="rebar-reading-view-message" data-rebar-part="empty">
        {empty}
      </div>
    );
  } else {
    body = (
      <>
        {verses?.length ? (
          <div className="rebar-reading-view-verses" data-rebar-part="verses">
            {verses.map((verse) => {
              const noted = notedVerses.includes(verse.num);
              const highlighted = isHighlighted(verse.num, highlight);
              const content = (
                <div>
                  <span className="rebar-reading-view-text">{verse.text}</span>
                  {onVerseAction ? (
                    <div>
                      <button
                        type="button"
                        className="rebar-reading-view-pill"
                        data-rebar-part="verse-action"
                        data-rebar-state={noted ? "done" : undefined}
                        aria-label={`${noted ? "Note added" : verseActionLabel}, verse ${verse.num}`}
                        onClick={() => onVerseAction(verse)}
                      >
                        {noted ? "Note added" : verseActionLabel}
                      </button>
                    </div>
                  ) : null}
                  {verse.extra ? (
                    <div className="rebar-reading-view-extra" data-rebar-part="verse-extra">
                      {verse.extra}
                    </div>
                  ) : null}
                </div>
              );
              return (
                <div
                  key={verse.num}
                  className="rebar-reading-view-verse"
                  data-rebar-part="verse"
                  data-rebar-highlighted={highlighted || undefined}
                  data-rebar-noted={noted || undefined}
                >
                  <sup className="rebar-reading-view-num" data-rebar-part="verse-number">
                    {verse.num}
                  </sup>
                  {renderVerse ? renderVerse(verse, { highlighted, noted, content }) : content}
                </div>
              );
            })}
          </div>
        ) : null}
        {children ? (
          <div className="rebar-reading-view-body" data-rebar-part="body">
            {children}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <article
      className={clsx("rebar-reading-view", className)}
      data-rebar-component="reading-view"
      data-rebar-tone={tone}
      data-rebar-verse-font={verseFont}
      data-rebar-state={error ? "error" : loading ? "loading" : undefined}
      {...props}
    >
      {title ? (
        <Heading level={2} className="rebar-reading-view-title" data-rebar-part="title">
          {title}
        </Heading>
      ) : null}
      <div className="rebar-reading-view-panel" data-rebar-part="panel">
        {citation ? (
          <span className="rebar-reading-view-citation" data-rebar-part="citation">
            {citation}
          </span>
        ) : null}
        {media && !error && !empty ? (
          <div className="rebar-reading-view-media" data-rebar-part="media">
            {media}
          </div>
        ) : null}
        {body}
        {actions && !error && !loading ? (
          <div className="rebar-reading-view-actions" data-rebar-part="actions">
            {actions}
          </div>
        ) : null}
        {footer && !loading ? (
          <div className="rebar-reading-view-footer" data-rebar-part="footer">
            {footer}
          </div>
        ) : null}
      </div>
    </article>
  );
}
