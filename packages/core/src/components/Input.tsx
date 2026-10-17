import { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  size?: "sm" | "md" | "lg";
  /** Marks the field as failing validation: sets `aria-invalid="true"` and `data-rebar-invalid`
   * (a theme styles these with a danger ring). An explicit `aria-invalid` prop still wins. */
  invalid?: boolean;
  /**
   * A format mask applied as the user types — `9` accepts a digit, `a` a letter, `*` any
   * character; every other character in the mask is a literal, inserted automatically (e.g.
   * `"(999) 999-9999"` or `"aaa-9999"`). Not a validation constraint by itself — pair with
   * `pattern`/`required` for that (see ref/HEURISTICS.md #26, constraints are shown, not just
   * enforced silently). Catalogued as a real, common gap (formatted phone/card-number fields)
   * rather than a new component — see ref/COMPONENT_BUILD_PLAN.md.
   */
  mask?: string;
  /**
   * An eye toggle at the end of a `type="password"` field (44px target). `true` is uncontrolled;
   * `{ visible, onVisibleChange }` is controlled. Opt-in: a bare password input stays a bare input.
   */
  revealable?: boolean | { visible: boolean; onVisibleChange?: (visible: boolean) => void };
  /** With `revealable`: hide the value again after 8 seconds, when the field loses focus, or when the page goes to the background. */
  autoHide?: boolean;
  /** A leading icon (a lock, a magnifier) inside the field. */
  startIcon?: ReactNode;
  /** The eye button's `aria-label` for each state. Defaults to "Show password" and "Hide password". */
  toggleLabels?: { show: string; hide: string };
}

/** Formats `raw` (mask-relevant characters only, in order) against `mask`, inserting the mask's
 * own literal characters as soon as enough input exists to reach them. */
function applyMask(mask: string, raw: string): string {
  let result = "";
  let rawIndex = 0;
  for (let i = 0; i < mask.length && rawIndex < raw.length; i++) {
    const maskChar = mask[i];
    const rawChar = raw[rawIndex] ?? "";
    if (maskChar === "9") {
      if (!/[0-9]/.test(rawChar)) return result;
      result += rawChar;
      rawIndex++;
    } else if (maskChar === "a") {
      if (!/[a-zA-Z]/.test(rawChar)) return result;
      result += rawChar;
      rawIndex++;
    } else if (maskChar === "*") {
      result += rawChar;
      rawIndex++;
    } else {
      result += maskChar;
      if (rawChar === maskChar) rawIndex++;
    }
  }
  return result;
}

/** The mask's own placeholder characters stripped out, leaving just what the user actually typed. */
function extractRaw(mask: string, value: string): string {
  const maskChars = new Set(mask.split("").filter((c) => c !== "9" && c !== "a" && c !== "*"));
  return value
    .split("")
    .filter((c) => !maskChars.has(c))
    .join("");
}

const AUTO_HIDE_MS = 8000;

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <path d="M4 4l16 16" /> : null}
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = "md", className, mask, onChange, invalid, revealable, autoHide, startIcon, toggleLabels, type, ...props },
  ref,
) {
  const handleMaskedChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (mask) {
      const raw = extractRaw(mask, event.target.value);
      event.target.value = applyMask(mask, raw);
    }
    onChange?.(event);
  };

  const canReveal = Boolean(revealable) && type === "password";
  const controlledVisible = typeof revealable === "object" && revealable !== null ? revealable : undefined;
  const [internalVisible, setInternalVisible] = useState(false);
  const visible = canReveal ? (controlledVisible ? controlledVisible.visible : internalVisible) : false;
  const setVisible = (next: boolean) => {
    if (!controlledVisible) setInternalVisible(next);
    controlledVisible?.onVisibleChange?.(next);
  };
  const setVisibleRef = useRef(setVisible);
  setVisibleRef.current = setVisible;

  useEffect(() => {
    if (!canReveal || !autoHide || !visible) return;
    const timer = setTimeout(() => setVisibleRef.current(false), AUTO_HIDE_MS);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") setVisibleRef.current(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [canReveal, autoHide, visible]);

  const field = (
    <input
      ref={ref}
      className={clsx("rebar-input", className)}
      data-rebar-component="input"
      data-rebar-size={size}
      aria-invalid={invalid ? true : undefined}
      data-rebar-invalid={invalid ? "true" : undefined}
      onChange={mask ? handleMaskedChange : onChange}
      placeholder={mask ? mask.replace(/9/g, "_").replace(/a/g, "_") : undefined}
      type={canReveal && visible ? "text" : type}
      {...props}
      onBlur={(event) => {
        props.onBlur?.(event);
        const next = event.relatedTarget as HTMLElement | null;
        if (canReveal && autoHide && visible && !next?.closest?.('[data-rebar-part="reveal"]')) setVisible(false);
      }}
    />
  );

  if (!canReveal && !startIcon) return field;

  const labels = toggleLabels ?? { show: "Show password", hide: "Hide password" };
  return (
    <span
      className="rebar-input-affix"
      data-rebar-part="affix"
      data-rebar-size={size}
      data-rebar-has-start={startIcon ? "true" : undefined}
      data-rebar-has-end={canReveal ? "true" : undefined}
    >
      {startIcon ? (
        <span className="rebar-input-start-icon" data-rebar-part="start-icon" aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      {field}
      {canReveal ? (
        <button
          type="button"
          className="rebar-input-reveal"
          data-rebar-part="reveal"
          aria-label={visible ? labels.hide : labels.show}
          aria-pressed={visible}
          disabled={props.disabled}
          onClick={() => setVisible(!visible)}
        >
          <EyeIcon off={visible} />
        </button>
      ) : null}
    </span>
  );
});
