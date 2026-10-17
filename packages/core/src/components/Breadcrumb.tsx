import { forwardRef } from "react";
import type { ReactNode } from "react";
import clsx from "clsx";
import { renderBionicChildren, useAmbientBionic } from "../bionic";
import type { BionicOptions } from "../bionic";
import { useRenderLink } from "./linkAdapter";
import type { RenderLink } from "./linkAdapter";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  /** Force bionic reading on/off for all items, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
  /** Link adapter for items with an `href`; defaults to the `RebarLinkProvider` adapter, then a plain `<a>`. */
  renderLink?: RenderLink;
}

import { defaultRenderLink as plainLink } from "./linkAdapter";

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = "/", className, bionic, bionicOptions, renderLink: renderLinkProp },
  ref,
) {
  const renderLink = useRenderLink(renderLinkProp, plainLink);
  const lastIndex = items.length - 1;
  const ambient = useAmbientBionic();
  const bionicEnabled = bionic ?? ambient;

  return (
    <nav ref={ref} aria-label="Breadcrumb" className={clsx("rebar-breadcrumb", className)} data-rebar-component="breadcrumb">
      <ol className="rebar-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          const label = renderBionicChildren(item.label, bionicEnabled, bionicOptions);
          return (
            <li key={index} className="rebar-breadcrumb-item" data-rebar-part="item">
              {isLast ? (
                <span aria-current="page">{label}</span>
              ) : item.href ? (
                renderLink({ href: item.href, children: label })
              ) : (
                <span>{label}</span>
              )}
              {!isLast ? (
                <span className="rebar-breadcrumb-separator" data-rebar-part="separator" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
