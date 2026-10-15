import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef, FormEvent, ReactNode } from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { Input } from "./Input";
import { Text } from "./Text";

export interface EmailCaptureProps extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit"> {
  /** The caller owns the network. A rejected promise or a throw puts the form in the `error` state. */
  onSubmit: (email: string) => Promise<void> | void;
  /** Accessible label for the input. Visually hidden unless the form carries `data-rebar-label-visible`. */
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  successMessage?: string;
  /** Shown when `onSubmit` throws. */
  errorMessage?: string;
  helperText?: ReactNode;
}

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailCapture({
  onSubmit,
  label = "Email address",
  placeholder = "you@example.com",
  submitLabel = "Notify me",
  successMessage = "Thanks, you're on the list.",
  errorMessage = "Something went wrong. Please try again.",
  helperText,
  className,
  ...props
}: EmailCaptureProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setValidationError(null);
    if (status === "success" || status === "error") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const value = email.trim();
    if (!value) {
      setValidationError("Enter your email address.");
      inputRef.current?.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setValidationError("Enter a valid email address.");
      inputRef.current?.focus();
      return;
    }
    setValidationError(null);
    setStatus("submitting");
    try {
      await onSubmit(value);
      if (!mounted.current) return;
      setEmail("");
      setStatus("success");
    } catch {
      if (!mounted.current) return;
      setStatus("error");
    }
  };

  const describedBy = [helperText ? helperId : null, validationError ? errorId : null].filter(Boolean).join(" ");

  return (
    <form
      className={clsx("rebar-email-capture", className)}
      data-rebar-component="email-capture"
      data-rebar-state={status}
      noValidate
      onSubmit={handleSubmit}
      {...props}
    >
      <label className="rebar-email-capture-label" data-rebar-part="label" htmlFor={inputId}>
        {label}
      </label>
      <div className="rebar-email-capture-row" data-rebar-part="row">
        <Input
          ref={inputRef}
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          placeholder={placeholder}
          onChange={handleChange}
          aria-invalid={validationError ? true : undefined}
          aria-describedby={describedBy || undefined}
          aria-busy={status === "submitting" || undefined}
        />
        <Button type="submit" disabled={status === "submitting"}>
          {submitLabel}
        </Button>
      </div>
      {helperText ? (
        <Text as="div" size="xs" color="secondary" id={helperId} data-rebar-part="helper">
          {helperText}
        </Text>
      ) : null}
      {validationError ? (
        <Text as="div" size="xs" id={errorId} className="rebar-email-capture-error" data-rebar-part="error">
          {validationError}
        </Text>
      ) : null}
      <div
        className="rebar-email-capture-status"
        data-rebar-part="status"
        data-rebar-tone={status === "success" || status === "error" ? status : undefined}
        role="status"
        aria-live="polite"
      >
        {status === "success" ? successMessage : status === "error" ? errorMessage : null}
      </div>
    </form>
  );
}
