import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { DatePicker } from "../components/DatePicker";

// These are compile-time checks (npm run typecheck): the callbacks below have no annotations.
describe("DatePicker onValueChange typing", () => {
  it("infers Date for the default, explicit single and dob modes without annotations", () => {
    const seen: number[] = [];
    render(
      <>
        <DatePicker onValueChange={(d) => seen.push(d.getTime())} />
        <DatePicker mode="single" onValueChange={(d) => seen.push(d.getTime())} />
        <DatePicker mode="dob" onValueChange={(d) => seen.push(d.getTime())} />
      </>,
    );
    expect(seen).toEqual([]);
  });

  it("infers { start, end } for range, set by `range` or by mode=\"range\"", () => {
    const seen: number[] = [];
    render(
      <>
        <DatePicker range onValueChange={(r) => seen.push(r.start.getTime() + r.end.getTime())} />
        <DatePicker mode="range" onValueChange={(r) => seen.push(r.start.getTime() + r.end.getTime())} />
      </>,
    );
    expect(seen).toEqual([]);
  });

  it("works with a typed state setter and rejects a mismatched handler", () => {
    function Demo() {
      const [date, setDate] = useState<Date | undefined>();
      return <DatePicker value={date} onValueChange={setDate} />;
    }
    render(<Demo />);
    // @ts-expect-error a single-date picker's handler gets a Date, not a range
    const bad = <DatePicker onValueChange={(r: { start: Date; end: Date }) => r.start} />;
    expect(bad).toBeTruthy();
  });

  it("mode=\"range\" really is a range picker at runtime", () => {
    render(<DatePicker mode="range" aria-label="Dates" />);
    expect(screen.getByLabelText("Dates")).toBeInTheDocument();
  });
});
