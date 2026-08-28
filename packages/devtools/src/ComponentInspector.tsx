import { useEffect, useState } from "react";

interface InspectedInfo {
  component: string;
  part?: string;
  state?: string;
  x: number;
  y: number;
}

export interface ComponentInspectorProps {
  enabled: boolean;
}

export function ComponentInspector({ enabled }: ComponentInspectorProps) {
  const [info, setInfo] = useState<InspectedInfo | null>(null);

  useEffect(() => {
    if (!enabled) {
      setInfo(null);
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-rebar-component]:not([data-rebar-component^='devtools'])",
      );

      if (!target) {
        setInfo(null);
        return;
      }

      setInfo({
        component: target.getAttribute("data-rebar-component") ?? "",
        part: target.getAttribute("data-rebar-part") ?? undefined,
        state: target.getAttribute("data-rebar-state") ?? undefined,
        x: event.clientX,
        y: event.clientY,
      });
    };

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, [enabled]);

  if (!enabled || !info) return null;

  return (
    <div
      className="rebar-devtools-inspector"
      data-rebar-component="devtools-inspector"
      style={{ left: info.x + 12, top: info.y + 12 }}
    >
      <strong>{info.component}</strong>
      {info.part ? <span> · {info.part}</span> : null}
      {info.state ? <span> · {info.state}</span> : null}
    </div>
  );
}
