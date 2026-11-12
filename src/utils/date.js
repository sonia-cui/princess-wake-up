// Dates are stored as local-time keys 'YYYY-MM-DD' so a "day" matches the user's own calendar.

export function toDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + n);
  return toDateKey(date);
}

function keyToUtc(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

// Whole days from a to b (b - a). UTC math so daylight-saving changes never shift the result.
export function daysBetween(a, b) {
  return Math.round((keyToUtc(b) - keyToUtc(a)) / 86400000);
}

export function formatDateZh(key) {
  const date = fromDateKey(key);
  const week = '日一二三四五六'[date.getDay()];
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日 · 周${week}`;
}
