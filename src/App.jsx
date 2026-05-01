import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { DEFAULT_SETTINGS } from "./utils/storage"; // also triggers migration as side-effect
import { updateStreak } from "./utils/streak";
import Timer from "./components/Timer";
import TimerSettings from "./components/TimerSettings";
import TaskInput from "./components/TaskInput";
import SessionList from "./components/SessionList";
import Stats from "./components/Stats";
import Analytics from "./components/Analytics";
import "./App.css";
import gsap from "gsap";
import CursorDraw from "./components/CursorDraw";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function Home() {
  const [settings, setSettings] = useLocalStorage(
    "gp_settings",
    DEFAULT_SETTINGS,
  );
  const [sessions, setSessions] = useLocalStorage("gp_sessions", []);
  const [streak, setStreak] = useLocalStorage("gp_streak", {
    current: 0,
    best: 0,
    lastCompletedDate: null,
  });
  const [stats, setStats] = useLocalStorage("gp_stats", {
    totalSessions: 0,
    totalMinutes: 0,
  });

  const [task, setTask] = useState("");
  const [tag, setTag] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notifPerm, setNotifPerm] = useState(() =>
    "Notification" in window ? Notification.permission : "unavailable",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const handleSessionComplete = useCallback(
    (durationMinutes) => {
      const session = {
        id: generateId(),
        task: task.trim() || "Untitled Session",
        tag,
        duration: durationMinutes,
        type: "focus",
        timestamp: new Date().toISOString(),
      };
      setSessions((prev) => [...prev, session]);
      setStreak((prev) => updateStreak(prev));
      setStats((prev) => ({
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + durationMinutes,
      }));
    },
    [task, tag, setSessions, setStreak, setStats],
  );

  const updateSettings = useCallback(
    (patch) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings],
  );

  const handleDeleteSession = useCallback(
    (id) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
    },
    [setSessions],
  );

  const handleEditSession = useCallback(
    (id, updates) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      );
    },
    [setSessions],
  );

  async function requestNotifications() {
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
  }

  useEffect(() => {
    gsap.fromTo(
      ".app-header",
      {
        y: "-100%",
        opacity: 0,
      },
      {
        opacity: 1,
        y: "0",
        duration: 0.6,
        ease: "back(1.5, 1.4)",
      },
    );
    gsap.fromTo(
      ".app-main div",
      {
        y: "100%",
        opacity: 0,
      },
      {
        opacity: 1,
        y: "0",
        duration: 0.6,
        stagger: 0.02,
        ease: "back(1.5, 1.4)",
      },
    );
  }, []);
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          Grind<span>Pulse</span>
        </div>
        <div className="header-actions">
          {notifPerm === "default" && (
            <button className="theme-toggle" onClick={requestNotifications}>
              Notify
            </button>
          )}
          <button
            className="theme-toggle"
            onClick={() =>
              updateSettings({
                theme: settings.theme === "dark" ? "light" : "dark",
              })
            }
          >
            {settings.theme === "dark" ? "☀ Light" : "☾ Dark"}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Stats stats={stats} streak={streak} sessions={sessions} />

        <Analytics sessions={sessions} />

        <TimerSettings
          settings={settings}
          onUpdate={updateSettings}
          disabled={isTimerRunning}
        />

        <TaskInput
          value={task}
          onChange={setTask}
          tag={tag}
          onTagChange={setTag}
          disabled={isTimerRunning}
        />

        <Timer
          focusDuration={settings.focusDuration}
          breakDuration={settings.breakDuration}
          autoMode={settings.autoMode}
          onSessionComplete={handleSessionComplete}
          onRunningChange={setIsTimerRunning}
          onAutoModeToggle={() =>
            updateSettings({ autoMode: !settings.autoMode })
          }
        />

        <SessionList
          sessions={sessions}
          onDelete={handleDeleteSession}
          onEdit={handleEditSession}
        />

        <Link to="/cursor-draw">
          {" "}
          <button id="lmaoo-btn">Want to have fun? Try click me!</button>
        </Link>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/cursor-draw" element={<CursorDraw></CursorDraw>}></Route>
      </Routes>
    </BrowserRouter>
  );
}
