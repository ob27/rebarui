import { createContext, forwardRef, useContext, useId, useState } from "react";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import type { ReactNode, Ref } from "react";
import clsx from "clsx";
import { useBionicChildren } from "../bionic";
import type { BionicOptions } from "../bionic";

export type RadioGroupProps = RadixRadioGroup.RadioGroupProps & {
  /** `"custom"` (default): Rebar's drawn dot. `"native"`: each `Radio` is the platform's `<input type="radio">`. */
  appearance?: "custom" | "native";
};

/** Shared by a group and its radios so a native radio knows the group's value, name and how to change it. */
const RadioGroupContext = createContext<{ appearance: "custom" | "native"; value: string | undefined; name: string; select: (value: string) => void; disabled?: boolean } | null>(null);

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, appearance = "custom", value, defaultValue, onValueChange, name, disabled, ...props },
  ref,
) {
  // The group owns the value either way, so a native radio (a plain input) and a custom one stay in step.
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const current = value !== undefined && value !== null ? value : internal;
  const uid = useId();
  const select = (next: string) => {
    if (value === undefined || value === null) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <RadioGroupContext.Provider value={{ appearance, value: current, name: name ?? uid, select, disabled }}>
      <RadixRadioGroup.Root
        ref={ref}
        className={clsx("rebar-radio-group", className)}
        data-rebar-component="radio-group"
        data-rebar-appearance={appearance === "native" ? "native" : undefined}
        value={current}
        onValueChange={select}
        name={name}
        disabled={disabled}
        {...props}
      />
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps extends Omit<RadixRadioGroup.RadioGroupItemProps, "asChild"> {
  children?: ReactNode;
  /** Marks the field as failing validation: sets `aria-invalid="true"` and `data-rebar-invalid`. */
  invalid?: boolean;
  /** Force bionic reading on/off for the label, overriding the ambient data-rebar-bionic setting. */
  bionic?: boolean;
  bionicOptions?: BionicOptions;
}

export const Radio = forwardRef<HTMLButtonElement, RadioProps>(function Radio(
  { className, children, bionic, bionicOptions, id, invalid, ...props },
  ref,
) {
  const label = useBionicChildren(children, bionic, bionicOptions);
  const group = useContext(RadioGroupContext);
  if (group?.appearance === "native") {
    const { value, disabled, required, onClick, onFocus, onBlur, onKeyDown, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy } = props;
    return (
      <label className="rebar-radio-label" htmlFor={id} data-rebar-appearance="native">
        <input
          ref={ref as unknown as Ref<HTMLInputElement>}
          id={id}
          type="radio"
          name={group.name}
          className={clsx("rebar-radio", "rebar-radio-native", className)}
          data-rebar-component="radio"
          aria-invalid={invalid ? true : undefined}
          data-rebar-invalid={invalid ? "true" : undefined}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          value={value}
          checked={group.value === value}
          disabled={disabled ?? group.disabled}
          required={required}
          onChange={() => group.select(value)}
          onClick={onClick as never}
          onFocus={onFocus as never}
          onBlur={onBlur as never}
          onKeyDown={onKeyDown as never}
        />
        {children ? <span data-rebar-part="label">{label}</span> : null}
      </label>
    );
  }
  return (
    <label className="rebar-radio-label" htmlFor={id}>
      <RadixRadioGroup.Item
        ref={ref}
        id={id}
        className={clsx("rebar-radio", className)}
        data-rebar-component="radio"
        aria-invalid={invalid ? true : undefined}
        data-rebar-invalid={invalid ? "true" : undefined}
        {...props}
      >
        <RadixRadioGroup.Indicator className="rebar-radio-indicator" data-rebar-part="indicator" />
      </RadixRadioGroup.Item>
      {children ? <span data-rebar-part="label">{label}</span> : null}
    </label>
  );
});
