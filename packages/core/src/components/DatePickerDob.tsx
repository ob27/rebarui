import { useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import clsx from "clsx";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { CalendarIcon, ChevronDownIcon } from "./icons";

export type DatePickerDobPresentation = "inline" | "popover" | "sheet";

export interface DatePickerDobProps
  extends Omit<ComponentPropsWithoutRef<"div">, "value" | "defaultValue" | "onChange"> {
  mode: "dob";
  /** The committed date. Commits on OK; OK stays disabled until year, month and day are all valid. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  /** `sheet` (default): a BottomSheet with step crumbs and Cancel / OK. `popover`: the same panel in
   * a popover. `inline`: the panel in place, no field. */
  presentation?: DatePickerDobPresentation;
  /** Minimum age in years (13 for Athic). A younger date shows `minAgeMessage` and disables OK. */
  minAge?: number;
  minAgeMessage?: ReactNode;
  /** Years and days outside the range are dimmed and inert. `maxDate` defaults to today. */
  minDate?: Date;
  maxDate?: Date;
  /** `[first, last]` year. Decade chips derive from it. Default: current year minus 100 to today. */
  yearRange?: [number, number];
  /** Field display tokens: `dd`, `mm`, `yyyy`. Default `"dd / mm / yyyy"`. */
  format?: string;
  disabled?: boolean;
  placeholder?: string;
  /** Title of the sheet or popover. Default "Date of birth". */
  title?: string;
  /** `sheet` only: render the sheet inside this element (for example a device frame) instead of the page body. */
  container?: HTMLElement | null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Step = "year" | "month" | "day";

function daysIn(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function formatWith(date: Date, format: string): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return format.replace(/yyyy/g, String(date.getFullYear())).replace(/dd/g, dd).replace(/mm/g, mm);
}
function ageOn(birth: Date, today: Date): number {
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

interface PanelProps {
  initial: Date | null;
  minAge?: number;
  minAgeMessage?: ReactNode;
  minDate?: Date;
  maxDate: Date;
  yearRange: [number, number];
  onConfirm: (date: Date) => void;
  /** Omit (inline presentation) to hide the Cancel button. */
  onCancel?: () => void;
}

function DobPanel({ initial, minAge, minAgeMessage, minDate, maxDate, yearRange, onConfirm, onCancel }: PanelProps) {
  const [year, setYear] = useState<number | null>(initial ? initial.getFullYear() : null);
  const [month, setMonth] = useState<number | null>(initial ? initial.getMonth() : null);
  const [day, setDay] = useState<number | null>(initial ? initial.getDate() : null);
  const [step, setStep] = useState<Step>("year");
  const [first, last] = yearRange;
  const decades: number[] = [];
  for (let d = Math.floor(first / 10) * 10; d <= last; d += 10) decades.push(d);
  const [decade, setDecade] = useState<number>(
    initial ? Math.floor(initial.getFullYear() / 10) * 10 : (decades[Math.min(decades.length - 1, Math.max(0, decades.length - 4))] ?? decades[0] ?? 1990),
  );

  const minD = minDate ? startOfDay(minDate) : null;
  const maxD = startOfDay(maxDate);
  const inRange = (y: number, m: number, d: number) => {
    const t = new Date(y, m, d).getTime();
    return t <= maxD.getTime() && (!minD || t >= minD.getTime());
  };
  const yearOk = (y: number) =>
    y >= first && y <= last && y <= maxD.getFullYear() && (!minD || y >= minD.getFullYear());
  const monthOk = (m: number) => year !== null && inRange(year, m, 1) || (year !== null && inRange(year, m, daysIn(year, m)));
  const dayOk = (d: number) => year !== null && month !== null && inRange(year, month, d);

  const chosen =
    year !== null && month !== null && day !== null && day <= daysIn(year, month) && inRange(year, month, day)
      ? new Date(year, month, day)
      : null;
  const tooYoung = chosen !== null && minAge !== undefined && ageOn(chosen, new Date()) < minAge;
  const valid = chosen !== null && !tooYoung;

  const pickYear = (y: number) => {
    setYear(y);
    if (month !== null && day !== null) setDay(Math.min(day, daysIn(y, month)));
    setStep("month");
  };
  const pickMonth = (m: number) => {
    setMonth(m);
    if (year !== null && day !== null) setDay(Math.min(day, daysIn(year, m)));
    setStep("day");
  };

  const crumb = (s: Step, label: string, value: string | null) => (
    <button
      key={s}
      type="button"
      className="rebar-dob-crumb"
      data-rebar-part="crumb"
      data-rebar-current={step === s || undefined}
      data-rebar-done={value !== null || undefined}
      aria-current={step === s ? "step" : undefined}
      disabled={s !== "year" && year === null ? true : s === "day" && month === null}
      onClick={() => setStep(s)}
    >
      {value ?? label}
    </button>
  );

  return (
    <div className="rebar-dob-panel" data-rebar-part="panel" data-rebar-step={step}>
      <div className="rebar-dob-crumbs" data-rebar-part="crumbs" role="group" aria-label="Date of birth steps">
        {crumb("year", "Year", year !== null ? String(year) : null)}
        <span aria-hidden="true">›</span>
        {crumb("month", "Month", month !== null ? MONTHS[month]! : null)}
        <span aria-hidden="true">›</span>
        {crumb("day", "Day", day !== null ? String(day) : null)}
      </div>
      {step === "year" ? (
        <>
          <div className="rebar-dob-decades" data-rebar-part="decades" role="group" aria-label="Decade">
            {decades.map((d) => (
              <button
                key={d}
                type="button"
                className="rebar-dob-chip"
                data-rebar-part="decade"
                aria-pressed={decade === d}
                onClick={() => setDecade(d)}
              >
                {d}s
              </button>
            ))}
          </div>
          <div className="rebar-dob-grid" data-rebar-part="years" role="group" aria-label="Year">
            {Array.from({ length: 10 }, (_, i) => decade + i).map((y) => (
              <button
                key={y}
                type="button"
                className="rebar-dob-cell"
                data-rebar-part="year"
                aria-pressed={year === y}
                disabled={!yearOk(y)}
                onClick={() => pickYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </>
      ) : null}
      {step === "month" ? (
        <div className="rebar-dob-grid" data-rebar-part="months" data-rebar-cols="3" role="group" aria-label="Month">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              type="button"
              className="rebar-dob-cell"
              data-rebar-part="month"
              aria-label={MONTH_LONG[i]}
              aria-pressed={month === i}
              disabled={!monthOk(i)}
              onClick={() => pickMonth(i)}
            >
              {m}
            </button>
          ))}
        </div>
      ) : null}
      {step === "day" && year !== null && month !== null ? (
        <div className="rebar-dob-grid" data-rebar-part="days" data-rebar-cols="7" role="group" aria-label="Day">
          {Array.from({ length: daysIn(year, month) }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              type="button"
              className="rebar-dob-cell"
              data-rebar-part="day"
              aria-pressed={day === d}
              disabled={!dayOk(d)}
              onClick={() => setDay(d)}
            >
              {d}
            </button>
          ))}
        </div>
      ) : null}
      {tooYoung ? (
        <div className="rebar-dob-error" data-rebar-part="error" role="alert">
          {minAgeMessage ?? `You must be at least ${minAge} years old.`}
        </div>
      ) : null}
      <div className="rebar-dob-footer" data-rebar-part="actions">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="button" disabled={!valid} onClick={() => chosen && onConfirm(chosen)}>
          OK
        </Button>
      </div>
    </div>
  );
}

/**
 * Date-of-birth mode of `DatePicker` (`mode="dob"`): year first, then month, then day, so nobody pages
 * a month grid back to 1990. Opinion: a three-step machine (year/month/day) with a commit step and
 * range/age validation, presented as a BottomSheet, a popover or inline.
 */
export function DatePickerDob(props: DatePickerDobProps) {
  const {
    mode: _mode,
    value,
    defaultValue = null,
    onValueChange,
    presentation = "sheet",
    minAge,
    minAgeMessage,
    minDate,
    maxDate,
    yearRange,
    format = "dd / mm / yyyy",
    disabled,
    placeholder,
    title = "Date of birth",
    container,
    className,
    ...rootProps
  } = props;
  const today = new Date();
  const range: [number, number] = yearRange ?? [today.getFullYear() - 100, today.getFullYear()];
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const [open, setOpen] = useState(false);
  const current = value !== undefined ? value : internal;
  const label = current ? formatWith(current, format) : null;
  const upper = maxDate ?? today;

  const confirm = (date: Date) => {
    if (value === undefined) setInternal(date);
    onValueChange?.(date);
    setOpen(false);
  };
  const panel = (inline = false) => (
    <DobPanel
      // Remount per opening so the steps restart from the committed value.
      key={String(open)}
      initial={current}
      minAge={minAge}
      minAgeMessage={minAgeMessage}
      minDate={minDate}
      maxDate={upper}
      yearRange={range}
      onConfirm={confirm}
      onCancel={inline ? undefined : () => setOpen(false)}
    />
  );

  const field = (
    <button
      type="button"
      className="rebar-select-trigger rebar-date-picker-field"
      data-rebar-part="field"
      disabled={disabled}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={label ? `${title}, ${label}. Change` : `${title}. Choose`}
      onClick={presentation === "sheet" ? () => setOpen(true) : undefined}
    >
      <span className="rebar-date-picker-icon" aria-hidden="true">
        <CalendarIcon />
      </span>
      <span className="rebar-date-picker-value" data-rebar-empty={!label || undefined}>
        {label ?? placeholder ?? format}
      </span>
      <span className="rebar-select-icon" aria-hidden="true">
        <ChevronDownIcon />
      </span>
    </button>
  );

  return (
    <div
      className={clsx("rebar-date-picker", className)}
      data-rebar-component="date-picker"
      data-rebar-mode="dob"
      data-rebar-presentation={presentation}
      role="group"
      aria-label={title}
      {...rootProps}
    >
      {presentation === "inline" ? (
        <div className="rebar-dob-inline" data-rebar-part="inline">
          {panel(true)}
        </div>
      ) : presentation === "popover" ? (
        <Popover
          open={open}
          onOpenChange={setOpen}
          trigger={field}
          contentProps={{ "data-rebar-part": "dob-popover", role: "dialog", "aria-label": title }}
        >
          {open ? panel() : null}
        </Popover>
      ) : (
        <>
          {field}
          <BottomSheet open={open} onOpenChange={setOpen} title={title} size={480} className="rebar-dob-sheet" container={container}>
            {open ? panel() : null}
          </BottomSheet>
        </>
      )}
    </div>
  );
}
