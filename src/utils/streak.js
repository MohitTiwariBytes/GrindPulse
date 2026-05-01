function toDateStr(date) {
  return date.toISOString().split("T")[0]; // yyyy-mm-dd
}

export function updateStreak(streak) {
  const today = toDateStr(new Date());

  // this means already completed the session today so no more addition now
  if (streak.lastCompletedDate === today) return streak;

  const yesterday = toDateStr(new Date(Date.now() - 86_400_000));
  const isConsecutive = streak.lastCompletedDate === yesterday;
  const newCurrent = isConsecutive ? streak.current + 1 : 1;

  return {
    current: newCurrent,
    best: Math.max(newCurrent, streak.best),
    lastCompletedDate: today,
  };
}
