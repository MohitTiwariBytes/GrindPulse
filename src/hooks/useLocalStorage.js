import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  const set = useCallback((updater) => {
    setValue(prev => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  return [value, set];
}
