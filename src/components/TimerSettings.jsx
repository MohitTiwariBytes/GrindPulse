import { useState } from "react";

const PRESETS = [
  { label: "25 / 5", focus: 25, break: 5 },
  { label: "50 / 10", focus: 50, break: 10 },
  { label: "90 / 20", focus: 90, break: 20 },
];

export default function TimerSettings({ settings, onUpdate, disabled }) {
  const [localFocus, setLocalFocus] = useState(settings.focusDuration);
  const [localBreak, setLocalBreak] = useState(settings.breakDuration);
  const [dirty, setDirty] = useState(false);

  function applyPreset(preset) {
    setLocalFocus(preset.focus);
    setLocalBreak(preset.break);
    setDirty(false);
    onUpdate({ focusDuration: preset.focus, breakDuration: preset.break });
  }

  function handleApply() {
    setDirty(false);
    onUpdate({ focusDuration: localFocus, breakDuration: localBreak });
  }

  const isActivePreset = (p) =>
    settings.focusDuration === p.focus && settings.breakDuration === p.break;

  return (
    <div className={`timer-settings${disabled ? " disabled" : ""}`}>
      <div className="presets-row">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset-btn${isActivePreset(p) ? " active" : ""}`}
            onClick={() => applyPreset(p)}
            disabled={disabled}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="sliders-row">
        <div className="slider-group">
          <span className="slider-label">
            Focus
            <span className="slider-value">{localFocus}m</span>
          </span>
          <input
            type="range"
            min="10"
            max="120"
            step="5"
            value={localFocus}
            className="duration-slider"
            disabled={disabled}
            onChange={(e) => {
              setLocalFocus(Number(e.target.value));
              setDirty(true);
            }}
          />
        </div>

        <div className="slider-group">
          <span className="slider-label">
            Break
            <span className="slider-value">{localBreak}m</span>
          </span>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={localBreak}
            className="duration-slider"
            disabled={disabled}
            onChange={(e) => {
              setLocalBreak(Number(e.target.value));
              setDirty(true);
            }}
          />
        </div>

        {dirty && (
          <button
            className="btn btn-primary btn-sm apply-btn"
            onClick={handleApply}
            disabled={disabled}
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
