import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { WaveformAudioPlayer } from "../components/WaveformAudioPlayer";

describe("WaveformAudioPlayer appearance=track", () => {
  it("draws a glyph play button, a seek rail with a fill and no bars or skip buttons", () => {
    const { container } = render(<WaveformAudioPlayer src="/a.mp3" appearance="track" />);
    const root = container.querySelector('[data-rebar-component="waveform-audio-player"]')!;
    expect(root).toHaveAttribute("data-rebar-appearance", "track");
    expect(screen.getByRole("button", { name: "Play" }).querySelector("svg")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Skip back" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Skip forward" })).toBeNull();
    expect(root.querySelectorAll('[data-rebar-part="bar"]')).toHaveLength(0);
    expect(root.querySelector('[data-rebar-part="fill"]')).not.toBeNull();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
    expect(screen.getByText("0:00 / 0:00")).toBeInTheDocument();
  });

  it("keeps the waveform, skip buttons and no appearance attribute by default", () => {
    const { container } = render(<WaveformAudioPlayer src="/a.mp3" barCount={8} />);
    const root = container.querySelector('[data-rebar-component="waveform-audio-player"]')!;
    expect(root).not.toHaveAttribute("data-rebar-appearance");
    expect(root.querySelectorAll('[data-rebar-part="bar"]')).toHaveLength(8);
    expect(screen.getByRole("button", { name: "Skip back" })).toBeInTheDocument();
    expect(root.querySelector('[data-rebar-part="fill"]')).toBeNull();
  });

  it("styles the track from --rebar-waveform-track-* properties", () => {
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    expect(css).toContain("--rebar-waveform-track-fill");
    expect(css).toContain("--rebar-waveform-track-glyph-size");
  });

  it("appearance=card shows elapsed and total time around the bars, uses barHeights and a custom play glyph", () => {
    const { container } = render(
      <WaveformAudioPlayer src="/a.mp3" appearance="card" barHeights={[30, 60, 90, 45]} playIcon={<svg data-testid="pi" />} />,
    );
    const root = container.querySelector('[data-rebar-component="waveform-audio-player"]')!;
    expect(root).toHaveAttribute("data-rebar-appearance", "card");
    const bars = root.querySelectorAll<HTMLElement>('[data-rebar-part="bar"]');
    expect(bars).toHaveLength(4);
    expect(bars[2]!.style.height).toBe("90%");
    expect(bars[0]).toHaveAttribute("data-played", "true");
    expect(bars[1]).not.toHaveAttribute("data-played");
    expect(screen.getByTestId("pi")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Skip back" })).toBeNull();
    expect(root.querySelector('[data-rebar-part="time-elapsed"]')).toHaveTextContent("0:00");
    expect(root.querySelector('[data-rebar-part="time"]')).toHaveTextContent("0:00");
  });
});
