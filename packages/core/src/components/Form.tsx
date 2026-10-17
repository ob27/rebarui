import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
  type UseFormRegisterReturn,
  type UseFormReturn,
  type RegisterOptions,
} from "react-hook-form";
import clsx from "clsx";
import { Text } from "./Text";

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<ComponentPropsWithoutRef<"form">, "onSubmit" | "children"> {
  onSubmit: SubmitHandler<TFieldValues>;
  defaultValues?: UseFormProps<TFieldValues>["defaultValues"];
  children: ReactNode | ((methods: UseFormReturn<TFieldValues>) => ReactNode);
  /**
   * Submission status, controlled by the caller (set `"submitting"` in `onSubmit`, then `"success"` or `"error"`).
   * `"submitting"` disables every field (a `<fieldset disabled>`) and sets `aria-busy`; `"error"` shows
   * `errorMessage` above the fields; `"success"` replaces the form with `successMessage` in a status
   * panel, and going back to `"idle"` resets the fields. Omit for the plain form.
   */
  status?: "idle" | "submitting" | "success" | "error";
  /** Shown in a `role="status"` panel instead of the form while `status="success"`. Put the headline, a line of detail and any "Send another" button here. */
  successMessage?: ReactNode;
  /** Shown in a `role="alert"` banner above the fields while `status="error"`. */
  errorMessage?: ReactNode;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  defaultValues,
  className,
  children,
  status,
  successMessage,
  errorMessage,
  ...props
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>({ defaultValues });
  const previous = useRef(status);
  const { reset } = methods;
  useEffect(() => {
    if (previous.current === "success" && status !== "success") reset();
    previous.current = status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "success" && successMessage !== undefined) {
    return (
      <FormProvider {...methods}>
        <div
          className={clsx("rebar-form-success", className)}
          data-rebar-component="form-success"
          role="status"
        >
          <span className="rebar-form-success-icon" data-rebar-part="icon" aria-hidden="true">
            &#10003;
          </span>
          <div className="rebar-form-success-body" data-rebar-part="body">
            {successMessage}
          </div>
        </div>
      </FormProvider>
    );
  }

  const content = typeof children === "function" ? children(methods) : children;
  return (
    <FormProvider {...methods}>
      <form
        className={clsx("rebar-form", className)}
        data-rebar-component="form"
        data-rebar-status={status}
        aria-busy={status === "submitting" ? true : undefined}
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        {...props}
      >
        {status === "error" && errorMessage ? (
          <div className="rebar-form-error" data-rebar-part="error-banner" role="alert">
            <span aria-hidden="true">&#9888;</span>
            <div>{errorMessage}</div>
          </div>
        ) : null}
        {status ? (
          <fieldset className="rebar-form-fieldset" data-rebar-part="fieldset" disabled={status === "submitting"}>
            {content}
          </fieldset>
        ) : (
          content
        )}
      </form>
    </FormProvider>
  );
}

export type RebarFieldProps = UseFormRegisterReturn & { id: string };

export interface FormItemProps {
  name: string;
  label: ReactNode;
  required?: boolean;
  rules?: Omit<RegisterOptions, "required">;
  children: (field: RebarFieldProps) => ReactNode;
}

export function FormItem({ name, label, required, rules, children }: FormItemProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const field: RebarFieldProps = {
    ...register(name, {
      required: required ? "This field is required" : false,
      ...rules,
    } as RegisterOptions),
    id: name,
  };

  const error = errors[name];

  return (
    <div className="rebar-form-item" data-rebar-component="form-item">
      <label className="rebar-form-item-label" htmlFor={name} data-rebar-part="label">
        <Text as="span" size="sm">
          {label}
          {required ? (
            <span className="rebar-form-item-required" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </Text>
      </label>
      {children(field)}
      {error ? (
        <Text
          as="span"
          size="xs"
          className="rebar-form-item-error"
          role="alert"
          data-rebar-part="error"
        >
          {typeof error.message === "string" && error.message.length > 0
            ? error.message
            : "Invalid value"}
        </Text>
      ) : null}
    </div>
  );
}
