import { useState } from "react";

const EDITABLE_TAGS = [
  "",
  "Coding",
  "Study",
  "Work",
  "Reading",
  "Exercise",
  "Other",
];

function formatDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function SessionList({ sessions, onDelete, onEdit }) {
  const [filterTag, setFilterTag] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editTag, setEditTag] = useState("");

  const allTags = [...new Set(sessions.map((s) => s.tag).filter(Boolean))];
  const filtered = filterTag
    ? sessions.filter((s) => s.tag === filterTag)
    : sessions;
  const displayed = [...filtered].reverse();

  function startEdit(session) {
    setEditingId(session.id);
    setEditTask(session.task);
    setEditTag(session.tag ?? "");
  }

  function saveEdit() {
    if (editTask.trim())
      onEdit(editingId, { task: editTask.trim(), tag: editTag });
    setEditingId(null);
  }

  if (sessions.length === 0) {
    return (
      <div className="sessions-empty">
        <p>No sessions yet &mdash; start focusing!</p>
      </div>
    );
  }

  return (
    <section className="session-section">
      <div className="session-header">
        <h2 className="section-title">Past Sessions</h2>

        {allTags.length > 0 && (
          <div className="filter-row">
            <button
              className={`filter-btn${filterTag === "" ? " active" : ""}`}
              onClick={() => setFilterTag("")}
            >
              All
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                className={`filter-btn${filterTag === t ? " active" : ""}`}
                onClick={() => setFilterTag(filterTag === t ? "" : t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {displayed.length === 0 ? (
        <p className="sessions-empty-inline">No sessions match this filter.</p>
      ) : (
        <div className="sessions">
          {displayed.map((s) => (
            <div key={s.id} className="session-card">
              {editingId === s.id ? (
                <div className="session-edit-form">
                  <input
                    className="edit-task-input"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    maxLength={120}
                    autoFocus
                  />
                  <select
                    className="edit-tag-select"
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                  >
                    {EDITABLE_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t || "No Tag"}
                      </option>
                    ))}
                  </select>
                  <div className="edit-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={saveEdit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="session-body">
                    <span className="session-task">{s.task}</span>
                    {s.tag && (
                      <span className="session-tag-badge">{s.tag}</span>
                    )}
                  </div>
                  <div className="session-footer">
                    <span className="session-meta">
                      <span className="session-duration">{s.duration}m</span>
                      {" · "}
                      <span className="session-date">
                        {formatDate(s.timestamp)}
                      </span>
                    </span>
                    <div className="session-actions">
                      <button
                        className="action-btn"
                        onClick={() => startEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn danger"
                        onClick={() => onDelete(s.id)}
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
