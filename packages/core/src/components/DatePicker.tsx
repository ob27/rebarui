import { useState } from "react";
import type { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover } from "./Popover";
import { CalendarIcon, ChevronDownIcon } from "./icons";
import { DatePickerDob } from "./DatePickerDob";
import type { DatePickerDobProps } from "./DatePickerDob";

/** A start/end pair for `range` mode. `end` is undefined while the second click is pending. */
export interface DatePickerRange {
  start?: Date;
  end?: Date;
}

interface DatePickerBaseProps extends Omit<ComponentPropsWithoutRef<"div">, "value" | "defaultValue" | "onChange"> {
  /** Dates outside the bounds render disabled in the calendar. */
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  /** Shown in the field while nothing is picked. */
  placeholder?: string;
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  range?: false;
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  /** Pick a start and an end day instead of one date. The value becomes `{ start, end }`. */
  range: true;
  value?: DatePickerRange;
  defaultValue?: DatePickerRange;
  /** Fires once both ends are chosen (start <= end; clicking an earlier day second swaps them). */
  onValueChange?: (range: { start: Date; end: Date }) => void;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps | DatePickerDobProps;

function dayStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** "Sat 24 Oct 2026". */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(",", "");
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * A date field that opens a calendar. The field is a pill showing the chosen date; activating it
 * opens a `Popover` holding a `Calendar` (month grid, previous/next, month/year drill-up, arrow-key
 * navigation) with a Today shortcut. Picking a day commits it and closes the popover.
 *
 * Value API is `Date` based and unchanged: `value`/`defaultValue`/`onValueChange`, bounded by
 * `minDate`/`maxDate`. With nothing picked the field shows `placeholder` (it no longer
 * pre-selects today). Set `range` for a start/end pair: the first click sets the start, the second
 * the end and commits, and `value` becomes `{ start, end }`.
 */
export function DatePicker(props: DatePickerProps) {
  if ("mode" in props && props.mode === "dob") return <DatePickerDob {...props} />;
  return <CalendarDatePicker {...(props as DatePickerSingleProps | DatePickerRangeProps)} />;
}

function CalendarDatePicker(props: DatePickerSingleProps | DatePickerRangeProps) {
  const { minDate, maxDate, disabled, placeholder = "Pick a date", className, ...rest } = props;
  // Strip the value API from what is spread onto the root element.
  const {
    range: _range,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...rootProps
  } = rest as typeof rest & { range?: boolean; value?: unknown; defaultValue?: unknown; onValueChange?: unknown };

  const isRange = props.range === true;
  const [open, setOpen] = useState(false);

  const [internalSingle, setInternalSingle] = useState<Date | undefined>(
    isRange ? undefined : (props as DatePickerSingleProps).defaultValue,
  );
  const [internalRange, setInternalRange] = useState<DatePickerRange | undefined>(
    isRange ? (props as DatePickerRangeProps).defaultValue : undefined,
  );
  // The first click of a range, held until the second arrives.
  const [pendingStart, setPendingStart] = useState<Date | undefined>(undefined);

  const controlledSingle = !isRange ? (props as DatePickerSingleProps).value : undefined;
  const controlledRange = isRange ? (props as DatePickerRangeProps).value : undefined;
  const single = !isRange ? (controlledSingle !== undefined ? controlledSingle : internalSingle) : undefined;
  const committedRange = isRange ? (controlledRange !== undefined ? controlledRange : internalRange) : undefined;

  const withinBounds = (date: Date) => {
    const d = dayStart(date).getTime();
    return (!minDate || d >= dayStart(minDate).getTime()) && (!maxDate || d <= dayStart(maxDate).getTime());
  };

  const pick = (date: Date) => {
    if (!isRange) {
      if ((props as DatePickerSingleProps).value === undefined) setInternalSingle(date);
      (props as DatePickerSingleProps).onValueChange?.(date);
      setOpen(false);
      return;
    }
    if (!pendingStart) {
      setPendingStart(date);
      return;
    }
    const [start, end] = pendingStart.getTime() <= date.getTime() ? [pendingStart, date] : [date, pendingStart];
    setPendingStart(undefined);
    if ((props as DatePickerRangeProps).value === undefined) setInternalRange({ start, end });
    (props as DatePickerRangeProps).onValueChange?.({ start, end });
    setOpen(false);
  };

  const pickToday = () => {
    const today = dayStart(new Date());
    if (withinBounds(today)) pick(today);
  };

  // The range shown in the grid: the pending first click wins until the second one lands.
  const shownRange: DatePickerRange | undefined = isRange
    ? pendingStart
      ? { start: pendingStart }
      : committedRange
    : undefined;

  const label = isRange
    ? committedRange?.start
      ? `${formatShort(committedRange.start)}${committedRange.end ? ` – ${formatShort(committedRange.end)}` : ""}`
      : undefined
    : single
      ? formatDate(single)
      : undefined;

  const anchorMonth = isRange ? (pendingStart ?? committedRange?.start) : single;

  return (
    <div
      className={clsx("rebar-date-picker", className)}
      data-rebar-component="date-picker"
      data-rebar-range={isRange || undefined}
      role="group"
      aria-label="Date"
      {...rootProps}
    >
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setPendingStart(undefined);
        }}
        trigger={
          <button
            type="button"
            className="rebar-select-trigger rebar-date-picker-field"
            data-rebar-part="field"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={label ? `${isRange ? "Date range" : "Date"}, ${label}. Change` : isRange ? "Pick a date range" : "Pick a date"}
          >
            <span className="rebar-date-picker-icon" aria-hidden="true">
              <CalendarIcon />
            </span>
            <span className="rebar-date-picker-value" data-rebar-empty={!label || undefined}>
              {label ?? placeholder}
            </span>
            <span className="rebar-select-icon" aria-hidden="true">
              <ChevronDownIcon />
            </span>
          </button>
        }
        contentProps={{ "data-rebar-part": "calendar-popover", role: "dialog", "aria-label": "Choose date" }}
      >
        <Calendar
          // Remount on open so the grid starts on the chosen month, not wherever it was left.
          key={String(open)}
          defaultMonth={anchorMonth}
          value={isRange ? undefined : single}
          rangeStart={shownRange?.start}
          rangeEnd={shownRange?.end}
          minDate={minDate}
          maxDate={maxDate}
          onValueChange={pick}
        />
        <div className="rebar-date-picker-footer" data-rebar-part="footer">
          <Button type="button" variant="tertiary" size="sm" onClick={pickToday} disabled={!withinBounds(new Date())}>
            Today
          </Button>
        </div>
      </Popover>
    </div>
  );
}
