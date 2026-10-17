import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<"textarea">, "size"> {
  /** Initial visible rows. Default 3. */
  rows?: number;
  /** Grows with its content up to `maxRows`, then scrolls. `true` is 2 to 8 rows. */
  autoSize?: boolean | { minRows?: number; maxRows?: number };
  /** Shows a counter under the field ("142 / 600" with a `maxLength`). It turns danger-coloured at the limit. */
  showCount?: boolean;
  /** Danger border and `aria-invalid`. Pair with an error message in `FormItem`. */
  invalid?: boolean;
  /** Type size 16 or 18px. Phone inputs stay at 16px or more to avoid iOS zoom. Default `"md"`. */
  size?: "md" | "lg";
  /** `"none"` or `"vertical"`. Default none on touch, vertical with a mouse. */
  resize?: "none" | "vertical";
  /** What sits between the length and the limit in the counter: `" / "` ("142 / 600", the default) or `"/"` ("142/600"). */
  countSeparator?: string;
}

/**
 * A multi-line field: row count, auto size, character count and an invalid state. Imitation: one native
 * `<textarea>` that mirrors a controlled or uncontrolled value.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { rows = 3, autoSize, showCount, invalid, size = "md", resize, countSeparator = " / ", className, value, defaultValue, onChange, maxLength, id, "aria-describedby": describedBy, style, ...props },
  ref,
) {
  const uid = useId();
  const countId = `${uid}-count`;
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const [internal, setInternal] = useState(String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const text = isControlled ? String(value) : internal;

  const minRows = typeof autoSize === "object" ? (autoSize.minRows ?? rows) : 2;
  const maxRows = typeof autoSize === "object" ? (autoSize.maxRows ?? 8) : 8;

  const fit = useCallback(() => {
    const el = innerRef.current;
    if (!el || !autoSize) return;
    const cs = typeof getComputedStyle === "function" ? getComputedStyle(el) : null;
    const lineHeight = parseFloat(cs?.lineHeight ?? "") || 24;
    const pad = (parseFloat(cs?.paddingTop ?? "") || 0) + (parseFloat(cs?.paddingBottom ?? "") || 0);
    el.style.height = "auto";
    const min = lineHeight * minRows + pad;
    const max = lineHeight * maxRows + pad;
    const next = Math.min(max, Math.max(min, el.scrollHeight));
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
  }, [autoSize, minRows, maxRows]);

  useLayoutEffect(fit, [fit, text]);
  useEffect(() => {
    if (!autoSize) return;
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [autoSize, fit]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInternal(event.target.value);
    onChange?.(event);
  };
  const atLimit = maxLength !== undefined && text.length >= maxLength;

  return (
    <div className="rebar-textarea-field" data-rebar-part="field">
      <textarea
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={id}
        className={clsx("rebar-textarea", className)}
        data-rebar-component="textarea"
        data-rebar-size={size}
        data-rebar-resize={resize}
        data-rebar-autosize={autoSize ? "true" : undefined}
        data-rebar-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid ? true : undefined}
        aria-describedby={clsx(describedBy, showCount && countId) || undefined}
        rows={rows}
        maxLength={maxLength}
        value={isControlled ? value : internal}
        onChange={handleChange}
        style={style}
        {...props}
      />
      {showCount ? (
        <div className="rebar-textarea-count" id={countId} data-rebar-part="count" data-rebar-at-limit={atLimit ? "true" : undefined}>
          {maxLength !== undefined ? `${text.length}${countSeparator}${maxLength}` : String(text.length)}
        </div>
      ) : null}
    </div>
  );
});
