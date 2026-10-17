import * as RadixToast from "@radix-ui/react-toast";
import { useContext } from "react";
import type { ReactNode } from "react";
import { ConfirmHost } from "./confirm";
import { ToasterHost, ToasterHostedContext } from "./toaster";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

/**
 * Mount once at the app root, wrapping everything — same pattern Radix itself documents.
 * Individual <Toast> components elsewhere in the tree render into this viewport via portal. The same
 * provider also hosts the imperative `toast()` stack and the `confirm()` dialog, so one provider serves
 * all three (a nested provider hosts nothing extra).
 */
export function ToastProvider({ children, max = 3 }: { children: ReactNode; /** How many imperative toasts show at once per position. Default 3. */ max?: number }) {
  const hosted = useContext(ToasterHostedContext);
  return (
    <RadixToast.Provider>
      <ToasterHostedContext.Provider value={true}>{children}</ToasterHostedContext.Provider>
      <RadixToast.Viewport className="rebar-toast-viewport" data-rebar-component="toast-viewport" />
      {hosted ? null : (
        <>
          <ToasterHost max={max} />
          <ConfirmHost />
        </>
      )}
    </RadixToast.Provider>
  );
}

export interface ToastProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  /** Force bionic reading on/off for the title/description, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  duration,
  bionic,
  bionicOptions,
}: ToastProps) {
  const titleContent = useBionicChildren(title, bionic, bionicOptions);
  const descriptionContent = useBionicChildren(description, bionic, bionicOptions);
  return (
    <RadixToast.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className="rebar-toast"
      data-rebar-component="toast"
      data-rebar-type={type}
    >
      <RadixToast.Title className="rebar-toast-title" data-rebar-part="title">
        {titleContent}
      </RadixToast.Title>
      {description ? (
        <RadixToast.Description data-rebar-part="description">{descriptionContent}</RadixToast.Description>
      ) : null}
      <RadixToast.Close className="rebar-toast-close" data-rebar-part="close" aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </RadixToast.Close>
    </RadixToast.Root>
  );
}
