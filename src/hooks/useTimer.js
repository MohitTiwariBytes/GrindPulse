import { useState, useEffect, useRef, useCallback } from 'react';

export const TIMER_MODES = { FOCUS: 'focus', BREAK: 'break' };

export function useTimer({ focusDuration, breakDuration, autoMode, onSessionComplete }) {
  const [mode, setMode] = useState(TIMER_MODES.FOCUS);
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Always-current config/mode refs to avoid stale closures in timeout callbacks
  const configRef = useRef(null);
  configRef.current = { focusDuration, breakDuration, autoMode, onSessionComplete };

  const modeRef = useRef(TIMER_MODES.FOCUS);
  modeRef.current = mode;

  const playBeep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  }, []);

  const sendNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body }); } catch {}
    }
  }, []);

  const handleComplete = useCallback((completedMode) => {
    const { focusDuration: fd, breakDuration: bd, autoMode: auto, onSessionComplete: onComplete } =
      configRef.current;

    if (completedMode === TIMER_MODES.FOCUS) {
      onComplete?.(fd);
      sendNotification('Focus complete!', 'Time for a break.');
      if (auto) {
        setTimeout(() => {
          setIsComplete(false);
          setMode(TIMER_MODES.BREAK);
          setSecondsLeft(bd * 60);
          setIsRunning(true);
        }, 1500);
      }
    } else {
      sendNotification('Break over!', 'Time to focus.');
      if (auto) {
        setTimeout(() => {
          setIsComplete(false);
          setMode(TIMER_MODES.FOCUS);
          setSecondsLeft(fd * 60);
          setIsRunning(true);
        }, 1500);
      }
    }
  }, [sendNotification]);

  // Recursive setTimeout pattern — StrictMode-safe
  useEffect(() => {
    if (!isRunning) return;
    const id = setTimeout(() => {
      if (secondsLeft <= 1) {
        const cm = modeRef.current;
        setSecondsLeft(0);
        setIsRunning(false);
        setIsComplete(true);
        playBeep();
        handleComplete(cm);
      } else {
        setSecondsLeft(s => s - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [isRunning, secondsLeft, playBeep, handleComplete]);

  // Sync secondsLeft when duration settings change (only safe when not running)
  const prevFocusRef = useRef(focusDuration);
  const prevBreakRef = useRef(breakDuration);
  useEffect(() => {
    const focusChanged = prevFocusRef.current !== focusDuration;
    const breakChanged = prevBreakRef.current !== breakDuration;
    prevFocusRef.current = focusDuration;
    prevBreakRef.current = breakDuration;

    if (!isRunning) {
      if (modeRef.current === TIMER_MODES.FOCUS && focusChanged) setSecondsLeft(focusDuration * 60);
      if (modeRef.current === TIMER_MODES.BREAK && breakChanged) setSecondsLeft(breakDuration * 60);
    }
  }, [focusDuration, breakDuration, isRunning]);

  const start = useCallback(() => {
    setIsComplete(false);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    const { focusDuration: fd, breakDuration: bd } = configRef.current;
    setSecondsLeft(modeRef.current === TIMER_MODES.FOCUS ? fd * 60 : bd * 60);
  }, []);

  const switchMode = useCallback((newMode) => {
    if (modeRef.current === newMode) return;
    setMode(newMode);
    setIsComplete(false);
    setIsRunning(false);
    const { focusDuration: fd, breakDuration: bd } = configRef.current;
    setSecondsLeft(newMode === TIMER_MODES.FOCUS ? fd * 60 : bd * 60);
  }, []);

  return { mode, secondsLeft, isRunning, isComplete, start, pause, reset, switchMode };
}
