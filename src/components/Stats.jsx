function formatTime(minutes) {
  if (!minutes) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function Stats({ stats, streak, sessions }) {
  const focusCount = sessions.filter((s) => s.type === "focus").length;
  const score = focusCount * 10 + streak.current * 2;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.totalSessions}</span>
        <span className="stat-label">Sessions</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{formatTime(stats.totalMinutes)}</span>
        <span className="stat-label">Focus Time</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{streak.current}</span>
        <span className="stat-label">Streak</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{streak.best}</span>
        <span className="stat-label">Best</span>
      </div>
      <div className="stat-card stat-score">
        <span className="stat-value">{score}</span>
        <span className="stat-label">Score</span>
      </div>
    </div>
  );
}
