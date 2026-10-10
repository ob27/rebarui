import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { Heading } from "./Heading";
import { Text } from "./Text";

export interface FeatureShowcaseProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  /** The media beside the text, usually a `<DeviceFrame>`. */
  media: ReactNode;
  /** Put the media on the other side at the tablet breakpoint and up. */
  reverse?: boolean;
  /** `"inverse"` uses the inverse colour tokens, for a dark band. */
  tone?: "default" | "inverse";
  /** Heading level for the title. Default `2`. */
  headingLevel?: 2 | 3;
}

export function FeatureShowcase({
  eyebrow,
  title,
  body,
  media,
  reverse = false,
  tone = "default",
  headingLevel = 2,
  className,
  ...props
}: FeatureShowcaseProps) {
  return (
    <section
      className={clsx("rebar-feature-showcase", className)}
      data-rebar-component="feature-showcase"
      data-rebar-tone={tone}
      data-rebar-reverse={reverse ? "true" : "false"}
      {...props}
    >
      <div className="rebar-feature-showcase-text" data-rebar-part="text">
        {eyebrow ? (
          <Text as="p" size="sm" className="rebar-feature-showcase-eyebrow" data-rebar-part="eyebrow">
            {eyebrow}
          </Text>
        ) : null}
        <Heading level={headingLevel} className="rebar-feature-showcase-title" data-rebar-part="title">
          {title}
        </Heading>
        {body ? (
          <Text as="div" className="rebar-feature-showcase-body" data-rebar-part="body">
            {body}
          </Text>
        ) : null}
      </div>
      <div className="rebar-feature-showcase-media" data-rebar-part="media">
        {media}
      </div>
    </section>
  );
}
