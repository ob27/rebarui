import { forwardRef } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import clsx from "clsx";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, fallback, className },
  ref,
) {
  return (
    <RadixAvatar.Root
      ref={ref}
      className={clsx("rebar-avatar", className)}
      data-rebar-component="avatar"
    >
      {src ? (
        <RadixAvatar.Image className="rebar-avatar-image" src={src} alt={alt ?? ""} />
      ) : null}
      <RadixAvatar.Fallback className="rebar-avatar-fallback" data-rebar-part="fallback">
        {fallback}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});
