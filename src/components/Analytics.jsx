const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatTime(minutes) {
  if (!minutes) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split("T")[0],
      label: WEEKDAYS[d.getDay()],
      isToday: i === 6,
      count: 0,
      minutes: 0,
    };
  });
}

export default function Analytics({ sessions }) {
  const days = getLast7Days();

  sessions
    .filter((s) => s.type === "focus")
    .forEach((s) => {
      const dateStr = s.timestamp.split("T")[0];
      const day = days.find((d) => d.dateStr === dateStr);
      if (day) {
        day.count++;
        day.minutes += s.duration;
      }
    });

  const today = days[6];
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <section className="analytics-section">
      <div className="analytics-today">
        <div className="today-chip">
          <span className="chip-value">{today.count}</span>
          <span className="chip-label">sessions today</span>
        </div>
        <div className="today-chip">
          <span className="chip-value">{formatTime(today.minutes)}</span>
          <span className="chip-label">focus today</span>
        </div>
      </div>

      <div className="weekly-chart">
        <span className="chart-title">Last 7 Days</span>
        <div className="chart-bars">
          {days.map((day) => (
            <div
              key={day.dateStr}
              className={`bar-col${day.isToday ? " today" : ""}`}
            >
              <span className="bar-count">
                {day.count > 0 ? day.count : ""}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${(day.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="bar-label">{day.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
