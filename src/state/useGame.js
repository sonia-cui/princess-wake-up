import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createInitialState,
  createProfile,
  ensureToday,
  completeTask,
  undoTask,
  swapTask,
} from '../logic/game.js';
import { loadState, saveState, clearState } from '../utils/storage.js';
import { toDateKey } from '../utils/date.js';

let feedbackSeq = 0;

// The one place where game logic meets React: holds state, persists it,
// rolls over at midnight, and queues feedback (gains, unlocked achievements) for the UI.
export function useGame() {
  const [state, setState] = useState(() => ensureToday(loadState() ?? createInitialState(), toDateKey()));
  const [feedback, setFeedback] = useState([]); // [{ id, kind: 'gain' | 'achievement', ... }]
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => saveState(state), [state]);

  // New day while the tab stays open (or the phone wakes up the next morning).
  useEffect(() => {
    const roll = () => setState((s) => ensureToday(s, toDateKey()));
    const timer = setInterval(roll, 60 * 1000);
    document.addEventListener('visibilitychange', roll);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', roll);
    };
  }, []);

  const pushFeedback = useCallback((items) => {
    const withIds = items.map((item) => ({ ...item, id: ++feedbackSeq }));
    setFeedback((list) => [...list, ...withIds]);
    for (const item of withIds) {
      const ttl = item.kind === 'achievement' ? 3200 : 1700;
      setTimeout(() => setFeedback((list) => list.filter((f) => f.id !== item.id)), ttl);
    }
  }, []);

  const saveProfile = useCallback((input) => {
    setState((s) => createProfile(s, input, toDateKey()));
  }, []);

  const toggleTask = useCallback(
    (taskId) => {
      const today = toDateKey();
      const current = ensureToday(stateRef.current, today);
      if (current.today.completedIds.includes(taskId)) {
        setState(undoTask(current, taskId, today));
        return;
      }
      const result = completeTask(current, taskId, today);
      setState(result.state);
      pushFeedback([
        ...Object.entries(result.gains).map(([key, value]) => ({ kind: 'gain', key, value })),
        ...result.unlocked.map((achievementId) => ({ kind: 'achievement', achievementId })),
      ]);
    },
    [pushFeedback],
  );

  const swap = useCallback((taskId) => {
    setState((s) => swapTask(ensureToday(s, toDateKey()), taskId, toDateKey()));
  }, []);

  const reset = useCallback(() => {
    clearState();
    setState(createInitialState());
  }, []);

  return { state, feedback, saveProfile, toggleTask, swap, reset };
}
