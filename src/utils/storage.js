const KEYS = {
  SESSIONS: "gp_sessions",
  STREAK: "gp_streak",
  STATS: "gp_stats",
  SETTINGS: "gp_settings",
  LEGACY_THEME: "gp_theme",
};

export const DEFAULT_SETTINGS = {
  focusDuration: 25,
  breakDuration: 5,
  autoMode: false,
  theme: "dark",
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function runMigration() {
  const legacyTheme = window.localStorage.getItem(KEYS.LEGACY_THEME);
  if (!window.localStorage.getItem(KEYS.SETTINGS)) {
    const settings = { ...DEFAULT_SETTINGS };
    if (legacyTheme) {
      settings.theme = legacyTheme === "light" ? "light" : "dark";
      window.localStorage.removeItem(KEYS.LEGACY_THEME);
    }
    safeWrite(KEYS.SETTINGS, settings);
  }

  const sessions = safeRead(KEYS.SESSIONS, []);
  const needsMigration = sessions.some(
    (s) => !s.id || !("tag" in s) || !s.type,
  );
  if (needsMigration) {
    const migrated = sessions.map((s) => ({
      id: s.id || generateId(),
      task: s.task ?? "",
      tag: s.tag ?? "",
      duration: s.duration ?? 25,
      type: s.type ?? "focus",
      timestamp: s.timestamp ?? new Date().toISOString(),
    }));
    safeWrite(KEYS.SESSIONS, migrated);
  }
}

runMigration();

export const getSessions = () => safeRead(KEYS.SESSIONS, []);
export const saveSessions = (v) => safeWrite(KEYS.SESSIONS, v);
export const getStreak = () =>
  safeRead(KEYS.STREAK, { current: 0, best: 0, lastCompletedDate: null });
export const saveStreak = (v) => safeWrite(KEYS.STREAK, v);
export const getStats = () =>
  safeRead(KEYS.STATS, { totalSessions: 0, totalMinutes: 0 });
export const saveStats = (v) => safeWrite(KEYS.STATS, v);
export const getSettings = () => safeRead(KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveSettings = (v) => safeWrite(KEYS.SETTINGS, v);
