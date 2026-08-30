import type { SVGProps } from "react";
import type { IconName } from "./schema";

function makeIcon(children: React.ReactNode, viewBox = "0 0 16 16") {
  return function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg width={16} height={16} viewBox={viewBox} fill="none" aria-hidden="true" {...props}>
        {children}
      </svg>
    );
  };
}

export const IconClose = makeIcon(
  <>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>,
);

export const IconInfo = makeIcon(
  <>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="4.75" r="0.9" fill="currentColor" />
    <path d="M8 7.25V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>,
);

export const IconRefresh = makeIcon(
  <>
    <path d="M13 8A5 5 0 1 1 11.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 3V6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>,
);

export const IconClock = makeIcon(
  <>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4.75V8L10.25 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>,
);

export const ICONS: Record<IconName, ReturnType<typeof makeIcon>> = {
  close: IconClose,
  info: IconInfo,
  refresh: IconRefresh,
  clock: IconClock,
};
