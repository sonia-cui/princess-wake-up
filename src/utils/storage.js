// Persistence: the whole game state is one JSON object in localStorage.
// `version` lets future releases migrate old saves instead of wiping them.

const STORAGE_KEY = 'princess-wake-up/v1';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.version === 1 ? parsed : null;
  } catch {
    return null; // private mode, blocked storage or corrupted data → start fresh
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the app keeps working in memory for this session.
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
