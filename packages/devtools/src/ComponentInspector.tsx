import { useEffect, useRef, useState } from "react";

interface InspectedInfo {
  component: string;
  part?: string;
  state?: string;
  /**
   * A stable, schema-shaped address into the placement-layer document this element came from —
   * e.g. `blocks[2].items[3]` — present only when the hovered element (or an ancestor) is
   * `@rebar-ui/placement` output. Lets a developer point at one exact block/item on screen and
   * hand that address to an LLM ("change blocks[2].items[3]'s badge to Draft") instead of
   * describing a screenshot and hoping the model locates the right spot in blocks.ts itself.
   */
  blockPath?: string;
  blockItemLabel?: string;
  x: number;
  y: number;
}

export interface ComponentInspectorProps {
  enabled: boolean;
}

export function ComponentInspector({ enabled }: ComponentInspectorProps) {
  const [info, setInfo] = useState<InspectedInfo | null>(null);
  const [copied, setCopied] = useState(false);
  // A click-to-copy button inside a tooltip that follows the cursor is unreachable in practice —
  // moving the mouse toward the button moves the hover target away first, so the tooltip either
  // relocates or disappears before the click lands. A hotkey (press "c" while hovering) needs no
  // pointer travel at all, so it's the only version of this that's actually usable.
  const infoRef = useRef<InspectedInfo | null>(null);
  infoRef.current = info;

  useEffect(() => {
    if (!enabled) {
      setInfo(null);
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement | null;
      const target = eventTarget?.closest<HTMLElement>(
        "[data-rebar-component]:not([data-rebar-component^='devtools'])",
      );

      if (!target) {
        setInfo(null);
        return;
      }

      // The block-path attribute lives on the placement-layer wrapper, which may be an ancestor
      // of (or the same element as) the closest data-rebar-component match — e.g. a Checkbox
      // inside a checklist item's Card. Search from the actual hovered element, not just `target`.
      const pathElement = eventTarget?.closest<HTMLElement>("[data-rebar-block-path]");

      setCopied(false);
      setInfo({
        component: target.getAttribute("data-rebar-component") ?? "",
        part: target.getAttribute("data-rebar-part") ?? undefined,
        state: target.getAttribute("data-rebar-state") ?? undefined,
        blockPath: pathElement?.getAttribute("data-rebar-block-path") ?? undefined,
        blockItemLabel: pathElement?.getAttribute("data-rebar-block-item-label") ?? undefined,
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const path = infoRef.current?.blockPath;
      if (!path) return;
      // Don't hijack "c" while the developer is actually typing somewhere on the page. (event.target
      // can be `document` itself, e.g. when nothing has focus, which has no `.closest`.)
      const eventTarget = event.target instanceof Element ? event.target : null;
      const typing = eventTarget?.closest("input, textarea, [contenteditable='true']");
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== "c") return;

      navigator.clipboard?.writeText(path).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    };

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  if (!enabled || !info) return null;

  return (
    <div
      className="rebar-devtools-inspector"
      data-rebar-component="devtools-inspector"
      style={{ left: info.x + 12, top: info.y + 12 }}
    >
      <div>
        <strong>{info.component}</strong>
        {info.part ? <span> · {info.part}</span> : null}
        {info.state ? <span> · {info.state}</span> : null}
      </div>
      {info.blockPath ? (
        <div className="rebar-devtools-inspector-path">
          <code>{info.blockPath}</code>
          {info.blockItemLabel ? <span> — &quot;{info.blockItemLabel}&quot;</span> : null}
          <span> · {copied ? "✓ copied" : "press C to copy"}</span>
        </div>
      ) : null}
    </div>
  );
}
