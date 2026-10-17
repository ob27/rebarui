import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef, CSSProperties, KeyboardEvent, ReactNode } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";
import { useAvatarPlaceholderSrc } from "./avatarPlaceholder";

export interface AvatarProps extends Omit<ComponentPropsWithoutRef<"span">, "className"> {
  src?: string;
  /** A tiny placeholder shown blurred immediately while `src` loads, then replaced by it (the same blur-up as `Image`'s `thumbSrc`). */
  thumbSrc?: string;
  alt?: string;
  fallback: string;
  className?: string;
  /**
   * Shows one of Rebar's built-in illustrated placeholder portraits when `src` isn't set yet —
   * opt-in, off by default, so existing plain-initials usage is unaffected. `true` picks one
   * deterministically from `fallback` (the same name always gets the same portrait); a number
   * picks a specific one directly (`placeholder % AVATAR_PLACEHOLDERS.length`).
   */
  placeholder?: boolean | number;
  /** Visual size — `sm`/`md`/`lg` as `Button`/`Input`, `xl` is 96px, a number is a diameter in px. Defaults to `"md"`. */
  size?: "sm" | "md" | "lg" | "xl" | number;
  /** A band over the bottom of the image (`"edit"` shows "Edit", or pass your own content). Makes the avatar a button: give it `onClick` and an `aria-label`. Needs a size of 64 or more. */
  overlay?: "edit" | ReactNode;
  /** A round badge on the bottom-right edge (a camera icon). The alternative to `overlay`. */
  badge?: ReactNode;
  /** A dim scrim with a spinner (uploading). Pointer events off, `aria-busy`. */
  loading?: boolean;
  /** A danger ring for a failed upload. */
  invalid?: boolean;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, thumbSrc, alt, fallback, className, placeholder, size = "md", overlay, badge, loading, invalid, onClick, style, ...props },
  ref,
) {
  const placeholderSrc = useAvatarPlaceholderSrc(src ? undefined : placeholder, fallback);
  const imageSrc = src ?? placeholderSrc;
  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const thumbActive = Boolean(thumbSrc && src && imageStatus !== "error");
  const interactive = overlay !== undefined && overlay !== false && overlay !== null ? true : Boolean(onClick);
  const numeric = typeof size === "number";
  const sizeStyle: CSSProperties | undefined = numeric
    ? ({ width: size, height: size, fontSize: Math.max(12, Math.round(size * 0.38)) } as CSSProperties)
    : undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (!interactive || loading) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const avatar = (
    <RadixAvatar.Root
      ref={ref}
      className={clsx("rebar-avatar", className)}
      data-rebar-component="avatar"
      data-rebar-size={numeric ? "custom" : size}
      data-rebar-loading={loading ? "true" : undefined}
      data-rebar-invalid={invalid ? "true" : undefined}
      data-rebar-thumb={thumbActive ? (imageStatus === "loaded" ? "settled" : "blur") : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive && !loading ? 0 : undefined}
      aria-busy={loading || undefined}
      aria-disabled={interactive && loading ? true : undefined}
      onClick={loading ? undefined : onClick}
      onKeyDown={handleKeyDown}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      {thumbActive ? <img className="rebar-avatar-thumb" data-rebar-part="thumb" src={thumbSrc} alt="" aria-hidden="true" /> : null}
      {imageSrc ? (
        <RadixAvatar.Image className="rebar-avatar-image" src={imageSrc} alt={alt ?? ""} onLoadingStatusChange={setImageStatus} />
      ) : null}
      <RadixAvatar.Fallback className="rebar-avatar-fallback" data-rebar-part="fallback">
        {fallback}
      </RadixAvatar.Fallback>
      {overlay !== undefined && overlay !== false && overlay !== null ? (
        <span className="rebar-avatar-overlay" data-rebar-part="overlay">
          {overlay === "edit" ? "Edit" : overlay}
        </span>
      ) : null}
      {loading ? (
        <span className="rebar-avatar-scrim" data-rebar-part="scrim" role="status" aria-label="Uploading">
          <span className="rebar-avatar-spinner" aria-hidden="true" />
        </span>
      ) : null}
    </RadixAvatar.Root>
  );

  if (!badge) return avatar;
  return (
    <span className="rebar-avatar-wrap" data-rebar-part="avatar-wrap">
      {avatar}
      <span className="rebar-avatar-badge" data-rebar-part="badge">
        {badge}
      </span>
    </span>
  );
});
