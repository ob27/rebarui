import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { WaveformAudioPlayer } from "../components/WaveformAudioPlayer";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

afterEach(cleanup);

describe("WaveformAudioPlayer fixes-2", () => {
  it("audioRef (object) receives the audio element, and crossOrigin is forwarded", () => {
    const ref = createRef<HTMLAudioElement>();
    render(<WaveformAudioPlayer src="/a.mp3" audioRef={ref} crossOrigin="anonymous" />);
    expect(ref.current?.tagName).toBe("AUDIO");
    expect(ref.current?.getAttribute("crossorigin")).toBe("anonymous");
    expect(ref.current?.getAttribute("src")).toBe("/a.mp3");
  });
  it("audioRef (callback) is called with the element", () => {
    let node: HTMLAudioElement | null = null;
    render(<WaveformAudioPlayer src="/a.mp3" audioRef={(n) => { node = n; }} />);
    expect(node).not.toBeNull();
  });
  it("controls=icons draws glyph buttons that keep their names and have no text label", () => {
    render(<WaveformAudioPlayer src="/a.mp3" controls="icons" />);
    const play = screen.getByRole("button", { name: "Play" });
    expect(play.querySelector("svg")).not.toBeNull();
    expect(play.textContent).toBe("");
    const back = screen.getByRole("button", { name: "Skip back" });
    expect(back.querySelector("svg")).not.toBeNull();
    expect(back.textContent).toBe("15");
    expect(screen.getByRole("group")).toHaveAttribute("data-rebar-controls", "icons");
  });
  it("default controls stay text", () => {
    render(<WaveformAudioPlayer src="/a.mp3" />);
    expect(screen.getByRole("button", { name: "Play" })).toHaveTextContent("Play");
    expect(screen.getByRole("group")).not.toHaveAttribute("data-rebar-controls");
  });
  it("size=compact sets the size marker", () => {
    render(<WaveformAudioPlayer src="/a.mp3" size="compact" />);
    expect(screen.getByRole("group")).toHaveAttribute("data-rebar-size", "compact");
  });
  it("the error message is an alert with the readable-danger rule in the stylesheet", () => {
    render(<WaveformAudioPlayer src="/a.mp3" error="Nope" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Nope");
    const css = readFileSync(resolve(__dirname, "../styles/style.css"), "utf8");
    expect(css).toMatch(/\.rebar-waveform-audio-player \.rebar-waveform-audio-player-message,[^{]*\{[^}]*color-mix\(in srgb, var\(--rebar-color-danger/);
    expect(css).toMatch(/\[data-rebar-tone="onDark"\] \.rebar-waveform-audio-player-message,[^{]*\{[^}]*#ffffff/);
  });
});
