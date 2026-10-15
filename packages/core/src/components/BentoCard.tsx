import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";
import { Text } from "./Text";

export interface BentoCardProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title: ReactNode;
  body?: ReactNode;
  /** Usually a whole `DeviceFrame`. The card sizes to it and never crops it. */
  media?: ReactNode;
  /** Columns taken on the wide (6-column) grid. Default `2`. */
  span?: 2 | 3 | 6;
  tone?: "default" | "tint-1" | "tint-2" | "tint-3" | "tint-4";
  /** `"below"`: text, then media centred under it. `"end"`: text at the start and media at the end
   * (wide grid only; stacks like `"below"` on narrow screens). Default `"below"`. */
  mediaPosition?: "below" | "end";
  /** Heading level for the title. Default `3`. */
  headingLevel?: 2 | 3;
}

export function BentoCard({
  title,
  body,
  media,
  span = 2,
  tone = "default",
  mediaPosition = "below",
  headingLevel = 3,
  className,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={clsx("rebar-bento-card", className)}
      data-rebar-component="bento-card"
      data-rebar-span={span}
      data-rebar-tone={tone}
      data-rebar-media-position={mediaPosition}
      {...props}
    >
      <div className="rebar-bento-card-text" data-rebar-part="text">
        <Heading level={headingLevel} className="rebar-bento-card-title" data-rebar-part="title">
          {title}
        </Heading>
        {body ? (
          <Text as="div" color="secondary" className="rebar-bento-card-body" data-rebar-part="body">
            {body}
          </Text>
        ) : null}
      </div>
      {media ? (
        <div className="rebar-bento-card-media" data-rebar-part="media">
          {media}
        </div>
      ) : null}
    </div>
  );
}
