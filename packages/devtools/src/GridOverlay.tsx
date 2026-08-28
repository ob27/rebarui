export interface GridOverlayProps {
  enabled: boolean;
}

export function GridOverlay({ enabled }: GridOverlayProps) {
  if (!enabled) return null;
  return <div className="rebar-devtools-grid-overlay" aria-hidden="true" data-rebar-component="devtools-grid" />;
}
