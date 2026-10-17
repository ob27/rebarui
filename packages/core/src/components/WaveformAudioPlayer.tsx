import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, KeyboardEvent, MouseEvent as ReactMouseEvent, MutableRefObject, ReactNode, Ref } from "react";
import clsx from "clsx";
import { Button } from "./Button";
import { Text } from "./Text";

export interface WaveformAudioPlayerProps extends Omit<ComponentPropsWithoutRef<"div">, "children" | "onTimeUpdate" | "onEnded"> {
  src: string;
  /** How many bars to render across the waveform. Default 48. */
  barCount?: number;
  /** Seconds the skip-back/skip-forward buttons jump by. Default 15. `0` hides both buttons (a compact bar for phones). */
  skipSeconds?: number;
  /** Slot at the end of the bar (save to library, share, speed). Give it a 40px minimum target. */
  trailingAction?: ReactNode;
  /** Start playing when mounted or when `src` changes. Browsers may block this; `onPlayBlocked` fires. */
  autoPlay?: boolean;
  onPlayBlocked?: () => void;
  /** Controlled play state, so a screen can pause one bar when another starts. */
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Fires when playback reaches the end. The bar then shows a replay glyph at full progress. */
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** A failed load or playback the caller knows about: red outline and a message below the bar
   * (a ReactNode is the message, `true` a default one); the play button then calls `onRetry`.
   * Unlike a native load failure, the controls stay visible. */
  error?: boolean | ReactNode;
  onRetry?: () => void;
  /** Spinner replaces the play glyph while buffering. Also set from the audio's own waiting event. */
  loading?: boolean;
  /** `"onDark"` for art cards such as a prayer detail. */
  tone?: "default" | "onDark";
  /** Ref (object or callback) to the underlying `<audio>` element, e.g. to read `currentTime` or hook Media Session. */
  audioRef?: Ref<HTMLAudioElement>;
  /** Forwarded to the `<audio>` element (`"anonymous"` for CORS-enabled sources). */
  crossOrigin?: "anonymous" | "use-credentials" | "";
  /** `"text"` (default) draws the labelled Play/Pause and skip buttons. `"icons"` draws round glyph buttons (play, pause, replay, skip) as in the Athic mock; each keeps its accessible name. */
  controls?: "text" | "icons";
  /** `"compact"` tightens the bar for lists and cards: smaller buttons, shorter waveform, smaller gaps. */
  size?: "default" | "compact";
  /** `"card"` is the app player: a raised rounded card with a round play button, the elapsed time, a short bar waveform and the total time (set by `--rebar-waveform-card-*`). `"track"` is the plain mobile player: a bare round play/pause glyph, a thin seek rail with a progress fill (no waveform bars, no skip buttons) and `m:ss / m:ss`. Sized by the `--rebar-waveform-track-*` properties. Default `"default"`. */
  appearance?: "default" | "track" | "card";
  /** Explicit bar heights (percent of the waveform height, 0 to 100) instead of the seeded pattern; one bar per entry. With `appearance="card"` a bar counts as played while its index over the bar count is at most the progress. */
  barHeights?: number[];
  /** Glyph for the play button (and pause with `pauseIcon`) in `appearance="card"`; a round glyph is drawn when omitted. */
  playIcon?: ReactNode;
  pauseIcon?: ReactNode;
}

function IconGlyph({ name, seconds }: { name: "play" | "pause" | "replay" | "retry" | "back" | "forward"; seconds?: number }) {
  const common = { viewBox: "0 0 24 24", "aria-hidden": true, focusable: false } as const;
  if (name === "play") return <svg {...common}><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>;
  if (name === "pause")
    return (
      <svg {...common}>
        <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" />
        <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" />
      </svg>
    );
  if (name === "replay" || name === "retry")
    return (
      <svg {...common}>
        <path d="M5 12a7 7 0 1 0 2.2-5.1M5 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  const back = name === "back";
  return (
    <svg {...common}>
      <path
        d={back ? "M4.5 11a7.5 7.5 0 1 1 2 5.2M4.5 5v6h6" : "M19.5 11a7.5 7.5 0 1 0-2 5.2M19.5 5v6h-6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {seconds ? (
        <text x="12" y="15.2" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor">
          {seconds}
        </text>
      ) : null}
    </svg>
  );
}

function TrackGlyph({ pause }: { pause?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" data-rebar-part="track-glyph">
      <circle cx="12" cy="12" r="10" />
      {pause ? (
        <>
          <rect x="9" y="7.5" width="2" height="9" fill="var(--rebar-waveform-glyph-ink, var(--rebar-color-bg-inverse, #12142b))" />
          <rect x="13" y="7.5" width="2" height="9" fill="var(--rebar-waveform-glyph-ink, var(--rebar-color-bg-inverse, #12142b))" />
        </>
      ) : (
        <path d="M10 8.5v7l6-3.5z" fill="var(--rebar-waveform-glyph-ink, var(--rebar-color-bg-inverse, #12142b))" />
      )}
    </svg>
  );
}

function mergeAudioRefs(...refs: (Ref<HTMLAudioElement> | undefined)[]) {
  return (node: HTMLAudioElement | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as MutableRefObject<HTMLAudioElement | null>).current = node;
    }
  };
}

// Same seeded-hash technique Sticky's rotation/color pick and Avatar's placeholder selection
// already use (see stickyColor.ts / avatarPlaceholder.ts) — never Math.random, so the same `src`
// always renders the same-looking waveform rather than reshuffling on every mount/reload.
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// No real amplitude data exists to visualize (this project's own low-fidelity philosophy, see
// agent.md — a decorative waveform, not a real audio analysis). A cheap linear congruential
// generator advanced from the seed hash gives a deterministic, good-enough-looking spread of bar
// heights (15%-100%) without pulling in a real FFT/waveform-extraction dependency.
function generateBarHeights(seed: string, count: number): number[] {
  const heights: number[] = [];
  let state = hashString(seed) || 1;
  for (let i = 0; i < count; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    heights.push(0.15 + ((state % 1000) / 1000) * 0.85);
  }
  return heights;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * An audio transport control with a bar-based waveform display — a real `<audio>` element
 * underneath (visually hidden), driven entirely by this component's own play/pause/seek logic.
 * The waveform is purely decorative (no real amplitude analysis, matching this project's
 * low-fidelity philosophy) but deterministic: the same `src` always renders the same bar pattern,
 * via a seeded hash rather than `Math.random` (see `generateBarHeights` above).
 *
 * The bars double as a real scrub bar — click/tap seeks to that position, and since a
 * click/drag-only scrub control would violate this project's own non-drag-fallback rule (see
 * ref/HEURISTICS.md #38), the waveform region is also a real `role="slider"`, keyboard-operable
 * (ArrowLeft/ArrowRight seek by 5s, Home/End jump to start/end).
 */
export function WaveformAudioPlayer({
  src,
  barCount = 48,
  skipSeconds = 15,
  trailingAction,
  autoPlay = false,
  onPlayBlocked,
  playing: playingProp,
  onPlayingChange,
  onEnded,
  onTimeUpdate,
  error: errorProp,
  onRetry,
  loading,
  tone = "default",
  audioRef: audioRefProp,
  crossOrigin,
  controls = "text",
  size = "default",
  appearance = "default",
  barHeights: barHeightsProp,
  playIcon,
  pauseIcon,
  className,
  "aria-label": ariaLabel = "Audio player",
  ...props
}: WaveformAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const setAudioRef = useMemo(() => mergeAudioRefs(audioRef, audioRefProp), [audioRefProp]);
  const waveformRef = useRef<HTMLDivElement>(null);
  const [internalPlaying, setInternalPlaying] = useState(false);
  const isControlled = playingProp !== undefined;
  const playing = isControlled ? playingProp : internalPlaying;
  const setPlaying = (next: boolean) => {
    if (!isControlled) setInternalPlaying(next);
    if (next !== playing) onPlayingChange?.(next);
  };
  const [ended, setEnded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const barHeights = useMemo(() => (barHeightsProp ? barHeightsProp.map(h => h / 100) : generateBarHeights(src, barCount)), [src, barCount, barHeightsProp]);

  // A new src is a genuinely new track — reset transport state rather than carrying over the
  // previous track's position/error/playing state onto it.
  useEffect(() => {
    setError(false);
    setInternalPlaying(false);
    setEnded(false);
    setBuffering(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const startPlayback = (audio: HTMLAudioElement) => {
    const result = audio.play() as Promise<void> | undefined;
    if (result && typeof result.catch === "function") {
      result.catch(() => {
        setPlaying(false);
        onPlayBlocked?.();
      });
    }
  };

  // autoPlay: runs after the reset effect above on a new src, so the track starts from the top.
  useEffect(() => {
    const audio = audioRef.current;
    if (!autoPlay || !audio) return;
    setInternalPlaying(true);
    onPlayingChange?.(true);
    startPlayback(audio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, autoPlay]);

  // Controlled: keep the real element in step with the caller's `playing`.
  useEffect(() => {
    const audio = audioRef.current;
    if (!isControlled || !audio) return;
    if (playingProp && audio.paused) startPlayback(audio);
    else if (!playingProp && !audio.paused) audio.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingProp]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    onTimeUpdate?.(audio.currentTime, Number.isFinite(audio.duration) ? audio.duration : 0);
  }, [onTimeUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
  }, []);

  const handleEnded = () => {
    setPlaying(false);
    setEnded(true);
    onEnded?.();
  };

  const handleError = () => {
    setError(true);
    setPlaying(false);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (errorProp) {
      onRetry?.();
      return;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (ended) {
        audio.currentTime = 0;
        setCurrentTime(0);
        setEnded(false);
      }
      startPlayback(audio);
      setPlaying(true);
    }
  };

  const seekTo = useCallback(
    (next: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const bounded = Math.min(Math.max(next, 0), duration || audio.duration || Infinity);
      const clamped = Number.isFinite(bounded) ? bounded : Math.max(next, 0);
      audio.currentTime = clamped;
      setCurrentTime(clamped);
    },
    [duration],
  );

  const skip = useCallback(
    (delta: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      seekTo(audio.currentTime + delta);
    },
    [seekTo],
  );

  const seekToRatio = useCallback(
    (ratio: number) => {
      if (!duration) return;
      seekTo(Math.min(Math.max(ratio, 0), 1) * duration);
    },
    [duration, seekTo],
  );

  const handleWaveformClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const el = waveformRef.current;
    if (!el || !duration) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    seekToRatio((e.clientX - rect.left) / rect.width);
  };

  const handleWaveformKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      skip(-5);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      skip(5);
    } else if (e.key === "Home") {
      e.preventDefault();
      seekToRatio(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seekToRatio(1);
    }
  };

  const isLoading = Boolean(loading) || buffering;
  const hasError = Boolean(errorProp);
  const playLabel = hasError ? "Retry" : isLoading ? "Buffering" : playing ? "Pause" : ended ? "Replay" : "Play";
  const playedCount = ended ? barCount : duration > 0 ? Math.round((currentTime / duration) * barCount) : 0;

  return (
    <div
      className={clsx("rebar-waveform-audio-player", className)}
      data-rebar-component="waveform-audio-player"
      data-rebar-tone={tone === "onDark" ? "onDark" : undefined}
      data-rebar-size={size === "compact" ? "compact" : undefined}
      data-rebar-controls={controls === "icons" ? "icons" : undefined}
      data-rebar-appearance={appearance === "track" ? "track" : appearance === "card" ? "card" : undefined}
      data-rebar-state={hasError ? "error" : isLoading ? "loading" : ended ? "ended" : playing ? "playing" : undefined}
      role="group"
      aria-label={ariaLabel}
      {...props}
    >
      <audio
        ref={setAudioRef}
        src={src}
        crossOrigin={crossOrigin}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        onWaiting={() => setBuffering(true)}
        onCanPlay={() => setBuffering(false)}
        onPlaying={() => setBuffering(false)}
        style={{ display: "none" }}
        data-rebar-part="audio"
      />
      {error ? (
        <Text className="rebar-waveform-audio-player-error" data-rebar-part="error" role="alert">
          Couldn't load this audio.
        </Text>
      ) : (
        <div className="rebar-waveform-audio-player-controls" data-rebar-part="controls">
          {skipSeconds > 0 && appearance === "default" ? (
          <Button
            aria-label="Skip back"
            data-rebar-part="skip-back"
            variant="secondary"
            onClick={() => skip(-skipSeconds)}
          >
            {controls === "icons" ? <IconGlyph name="back" seconds={skipSeconds} /> : <>«{skipSeconds}</>}
          </Button>
          ) : null}
          <Button
            aria-label={playLabel}
            data-rebar-part="play-button"
            data-rebar-state={isLoading ? "loading" : ended && !playing ? "replay" : undefined}
            aria-busy={isLoading || undefined}
            onClick={togglePlay}
          >
            {isLoading ? <span className="rebar-waveform-audio-player-spinner" aria-hidden="true" /> : null}
            {isLoading ? (
              <span className="rebar-visually-hidden">Buffering</span>
            ) : appearance === "card" && (playing ? pauseIcon : playIcon) ? (
              (playing ? pauseIcon : playIcon)
            ) : appearance === "track" || appearance === "card" ? (
              <TrackGlyph pause={playing} />
            ) : controls === "icons" ? (
              <IconGlyph name={playing ? "pause" : ended ? "replay" : hasError ? "retry" : "play"} />
            ) : playing ? (
              "Pause"
            ) : ended ? (
              "Replay"
            ) : hasError ? (
              "Retry"
            ) : (
              "Play"
            )}
          </Button>
          {skipSeconds > 0 && appearance === "default" ? (
          <Button
            aria-label="Skip forward"
            data-rebar-part="skip-forward"
            variant="secondary"
            onClick={() => skip(skipSeconds)}
          >
            {controls === "icons" ? <IconGlyph name="forward" seconds={skipSeconds} /> : <>{skipSeconds}»</>}
          </Button>
          ) : null}
          {appearance === "card" ? (
            <Text className="rebar-waveform-audio-player-time" size="xs" data-rebar-part="time-elapsed">
              {formatTime(currentTime)}
            </Text>
          ) : null}
          <div
            ref={waveformRef}
            className="rebar-waveform-audio-player-waveform"
            data-rebar-part="waveform"
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
            onClick={handleWaveformClick}
            onKeyDown={handleWaveformKeyDown}
          >
            {appearance === "track" ? (
              <span
                className="rebar-waveform-audio-player-fill"
                data-rebar-part="fill"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            ) : null}
            {appearance === "track" ? null : barHeights.map((height, i) => (
              <span
                key={i}
                className="rebar-waveform-audio-player-bar"
                data-rebar-part="bar"
                data-played={(appearance === "card" ? i / barHeights.length <= (duration > 0 ? currentTime / duration : 0) : i < playedCount) ? "true" : undefined}
                style={{ height: barHeightsProp ? `${Number((height * 100).toFixed(4))}%` : `${Math.round(height * 100)}%` }}
              />
            ))}
          </div>
          <Text className="rebar-waveform-audio-player-time" size="xs" data-rebar-part="time">
            {appearance === "card" ? formatTime(duration) : `${formatTime(currentTime)} / ${formatTime(duration)}`}
          </Text>
          {trailingAction ? (
            <span className="rebar-waveform-audio-player-trailing" data-rebar-part="trailing-action">
              {trailingAction}
            </span>
          ) : null}
        </div>
      )}
      {hasError && !error ? (
        <Text className="rebar-waveform-audio-player-message" size="sm" role="alert" data-rebar-part="message">
          {errorProp === true ? "Couldn't play this recording. Tap play to try again." : errorProp}
        </Text>
      ) : null}
    </div>
  );
}
