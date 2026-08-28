import * as RadixToast from "@radix-ui/react-toast";
import type { ReactNode } from "react";

/**
 * Mount once at the app root, wrapping everything — same pattern Radix itself documents.
 * Individual <Toast> components elsewhere in the tree render into this viewport via portal.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <RadixToast.Provider>
      {children}
      <RadixToast.Viewport className="rebar-toast-viewport" data-rebar-component="toast-viewport" />
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
}

export function Toast({ open, onOpenChange, title, description, type = "info", duration }: ToastProps) {
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
        {title}
      </RadixToast.Title>
      {description ? (
        <RadixToast.Description data-rebar-part="description">{description}</RadixToast.Description>
      ) : null}
      <RadixToast.Close className="rebar-toast-close" data-rebar-part="close" aria-label="Close">
        ×
      </RadixToast.Close>
    </RadixToast.Root>
  );
}
