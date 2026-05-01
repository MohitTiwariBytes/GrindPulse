import { useEffect } from "react";
import { useTimer, TIMER_MODES } from "../hooks/useTimer";

export default function Timer({
  focusDuration,
  breakDuration,
  autoMode,
  onSessionComplete,
  onRunningChange,
  onAutoModeToggle,
}) {
  const {
    mode,
    secondsLeft,
    isRunning,
    isComplete,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer({
    focusDuration,
    breakDuration,
    autoMode,
    onSessionComplete,
  });

  useEffect(() => {
    onRunningChange?.(isRunning);
  }, [isRunning, onRunningChange]);

  const totalSeconds =
    mode === TIMER_MODES.FOCUS ? focusDuration * 60 : breakDuration * 60;
  const r = 88;
  const C = 2 * Math.PI * r;
  const dashoffset = C * (secondsLeft / (totalSeconds || 1));

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="timer-card">
      <div className="mode-tabs">
        <button
          className={`mode-tab${mode === TIMER_MODES.FOCUS ? " active" : ""}`}
          onClick={() => switchMode(TIMER_MODES.FOCUS)}
          disabled={isRunning}
        >
          Focus
        </button>
        <button
          className={`mode-tab${mode === TIMER_MODES.BREAK ? " active" : ""}`}
          onClick={() => switchMode(TIMER_MODES.BREAK)}
          disabled={isRunning}
        >
          Break
        </button>
      </div>

      <div className="timer-ring-wrapper">
        <svg className="timer-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={r} className="ring-bg" />
          <circle
            cx="100"
            cy="100"
            r={r}
            className="ring-progress"
            strokeDasharray={C}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <div className="timer-display">
          <span className="timer-time">
            {mm}:{ss}
          </span>
          <span className="timer-mode-label">
            {mode === TIMER_MODES.FOCUS ? "Focus" : "Break"}
          </span>
        </div>
      </div>

      {isComplete && <div className="session-complete">Session Complete!</div>}

      <div className="timer-controls">
        {isComplete ? (
          <button className="btn btn-secondary" onClick={reset}>
            New Session
          </button>
        ) : !isRunning ? (
          <button className="btn btn-primary" onClick={start}>
            {secondsLeft < totalSeconds ? "Resume" : "Start"}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={pause}>
            Pause
          </button>
        )}
        {!isComplete && (
          <button
            className="btn btn-ghost"
            onClick={reset}
            disabled={isRunning}
          >
            Reset
          </button>
        )}
      </div>

      <label className="auto-toggle">
        <input type="checkbox" checked={autoMode} onChange={onAutoModeToggle} />
        <span className="auto-toggle-label">Auto-start next session</span>
      </label>
    </div>
  );
}
