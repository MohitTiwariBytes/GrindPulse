const TAGS = ['Coding', 'Study', 'Work', 'Reading', 'Exercise', 'Other'];

export default function TaskInput({ value, onChange, tag, onTagChange, disabled }) {
  return (
    <div className="task-section">
      <input
        type="text"
        className="task-input"
        placeholder="What are you working on?"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        maxLength={120}
      />
      <div className="tag-row">
        {TAGS.map(t => (
          <button
            key={t}
            className={`tag-btn${tag === t ? ' active' : ''}`}
            onClick={() => onTagChange(tag === t ? '' : t)}
            disabled={disabled}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
