import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WaveformAudioPlayer } from "../components/WaveformAudioPlayer";

afterEach(cleanup);

let playMock: ReturnType<typeof vi.fn>;
let pauseMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  playMock = vi.fn().mockResolvedValue(undefined);
  pauseMock = vi.fn();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(playMock);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pauseMock);
});

describe("WaveformAudioPlayer additions", () => {
  it("renders trailingAction at the end of the bar", () => {
    render(<WaveformAudioPlayer src="a.mp3" trailingAction={<button aria-label="Save to Library">S</button>} />);
    expect(screen.getByRole("button", { name: "Save to Library" }).closest('[data-rebar-part="trailing-action"]')).not.toBeNull();
  });

  it("autoPlay starts playback on mount", () => {
    render(<WaveformAudioPlayer src="a.mp3" autoPlay />);
    expect(playMock).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("autoPlay blocked by the browser reports onPlayBlocked and returns to Play", async () => {
    playMock.mockRejectedValue(new Error("NotAllowedError"));
    const onPlayBlocked = vi.fn();
    render(<WaveformAudioPlayer src="a.mp3" autoPlay onPlayBlocked={onPlayBlocked} />);
    await vi.waitFor(() => expect(onPlayBlocked).toHaveBeenCalled());
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("no autoPlay by default", () => {
    render(<WaveformAudioPlayer src="a.mp3" />);
    expect(playMock).not.toHaveBeenCalled();
  });

  it("controlled playing drives the element and reports changes", async () => {
    const onPlayingChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<WaveformAudioPlayer src="a.mp3" playing={false} onPlayingChange={onPlayingChange} />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(onPlayingChange).toHaveBeenCalledWith(true);
    // parent has not flipped it, so the bar still reads Play
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    rerender(<WaveformAudioPlayer src="a.mp3" playing onPlayingChange={onPlayingChange} />);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    expect(playMock).toHaveBeenCalled();
  });

  it("ended returns to a replay glyph at full progress and fires onEnded", () => {
    const onEnded = vi.fn();
    render(<WaveformAudioPlayer src="a.mp3" onEnded={onEnded} barCount={10} data-testid="w" />);
    fireEvent.ended(document.querySelector("audio")!);
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Replay" })).toBeInTheDocument();
    expect(screen.getByTestId("w")).toHaveAttribute("data-rebar-state", "ended");
    expect(document.querySelectorAll("[data-played]")).toHaveLength(10);
  });

  it("replay restarts from zero", async () => {
    const user = userEvent.setup();
    render(<WaveformAudioPlayer src="a.mp3" />);
    const audio = document.querySelector("audio")!;
    fireEvent.ended(audio);
    await user.click(screen.getByRole("button", { name: "Replay" }));
    expect(playMock).toHaveBeenCalled();
    expect(audio.currentTime).toBe(0);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("onTimeUpdate reports the position", () => {
    const onTimeUpdate = vi.fn();
    render(<WaveformAudioPlayer src="a.mp3" onTimeUpdate={onTimeUpdate} />);
    fireEvent.timeUpdate(document.querySelector("audio")!);
    expect(onTimeUpdate).toHaveBeenCalledWith(0, 0);
  });

  it("loading swaps the play glyph for a spinner and marks the button busy", () => {
    render(<WaveformAudioPlayer src="a.mp3" loading data-testid="w" />);
    const btn = screen.getByRole("button", { name: "Buffering" });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn.querySelector(".rebar-waveform-audio-player-spinner")).not.toBeNull();
    expect(screen.getByTestId("w")).toHaveAttribute("data-rebar-state", "loading");
  });

  it("the audio element's own waiting and canplay events toggle buffering", () => {
    render(<WaveformAudioPlayer src="a.mp3" />);
    const audio = document.querySelector("audio")!;
    fireEvent.waiting(audio);
    expect(screen.getByRole("button", { name: "Buffering" })).toBeInTheDocument();
    fireEvent.canPlay(audio);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("error keeps the controls, shows an alert and makes play call onRetry", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(<WaveformAudioPlayer src="a.mp3" error onRetry={onRetry} data-testid="w" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn't play this recording");
    expect(screen.getByTestId("w")).toHaveAttribute("data-rebar-state", "error");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(playMock).not.toHaveBeenCalled();
  });

  it("a ReactNode error is the message", () => {
    render(<WaveformAudioPlayer src="a.mp3" error="Offline right now" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Offline right now");
  });

  it("tone onDark sets an attribute", () => {
    render(<WaveformAudioPlayer src="a.mp3" tone="onDark" data-testid="w" />);
    expect(screen.getByTestId("w")).toHaveAttribute("data-rebar-tone", "onDark");
  });
});
