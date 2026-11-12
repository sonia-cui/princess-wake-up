import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createProfile,
  ensureToday,
  completeTask,
  undoTask,
  swapTask,
  swapsLeft,
  displayStreak,
} from '../src/logic/game.js';
import { generateDailyTasks, eligibleTasks } from '../src/logic/taskEngine.js';
import { conditionValue } from '../src/logic/achievements.js';
import { taskById } from '../src/data/tasks.js';
import { SWAPS_PER_DAY } from '../src/data/profileOptions.js';
import { addDays, daysBetween } from '../src/utils/date.js';
import { levelInfo } from '../src/utils/levels.js';

const DAY = '2026-11-12';
const baseInput = { nickname: '可曼', age: 25, status: 'student', dailyMinutes: 30, budget: 0 };

function startedState(input = baseInput, today = DAY) {
  return createProfile(createInitialState(), input, today);
}

describe('task generation', () => {
  it('gives the number of tasks the daily time allows', () => {
    expect(startedState().today.taskIds).toHaveLength(4);
    expect(startedState({ ...baseInput, dailyMinutes: 120, budget: 2 }).today.taskIds).toHaveLength(6);
  });

  it('respects time and money budget', () => {
    const profile = { ...baseInput, createdAt: DAY };
    for (const id of generateDailyTasks(profile, DAY)) {
      expect(taskById[id].minutes).toBeLessThanOrEqual(30);
      expect(taskById[id].cost).toBe(0);
    }
    expect(eligibleTasks(profile).every((t) => t.cost === 0)).toBe(true);
  });

  it('is stable for the same day and changes across days', () => {
    const profile = { ...baseInput, createdAt: DAY };
    expect(generateDailyTasks(profile, DAY)).toEqual(generateDailyTasks(profile, DAY));
    const week = Array.from({ length: 7 }, (_, i) => generateDailyTasks(profile, addDays(DAY, i)).join());
    expect(new Set(week).size).toBeGreaterThan(1);
  });

  it('prefers different categories within a day', () => {
    const ids = startedState().today.taskIds;
    const categories = ids.map((id) => taskById[id].category);
    expect(new Set(categories).size).toBe(categories.length);
  });

  it('starts a new list on a new day', () => {
    const s = startedState();
    const next = ensureToday(s, addDays(DAY, 1));
    expect(next.today.date).toBe(addDays(DAY, 1));
    expect(next.today.completedIds).toEqual([]);
  });
});

describe('completing tasks', () => {
  it('applies the reward defined in data and reports the gains', () => {
    const s = startedState();
    const id = s.today.taskIds[0];
    const { state, gains } = completeTask(s, id, DAY);
    expect(gains).toEqual(taskById[id].reward);
    for (const [k, v] of Object.entries(taskById[id].reward)) expect(state.attributes[k]).toBe(v);
    expect(state.stats.totalCompleted).toBe(1);
  });

  it('cannot complete the same task twice', () => {
    const s = startedState();
    const id = s.today.taskIds[0];
    const once = completeTask(s, id, DAY).state;
    const twice = completeTask(once, id, DAY);
    expect(twice.state).toBe(once);
    expect(twice.gains).toEqual({});
  });

  it('undo returns points', () => {
    const s = startedState();
    const id = s.today.taskIds[0];
    const done = completeTask(s, id, DAY).state;
    const undone = undoTask(done, id, DAY);
    expect(undone.attributes).toEqual(s.attributes);
    expect(undone.stats.totalCompleted).toBe(0);
  });

  it('unlocks First Step on the first completion and Perfect Day when all are done', () => {
    let s = startedState();
    const first = completeTask(s, s.today.taskIds[0], DAY);
    expect(first.unlocked).toContain('first-step');
    s = first.state;
    let last;
    for (const id of s.today.taskIds.slice(1)) {
      last = completeTask(s, id, DAY);
      s = last.state;
    }
    expect(last.unlocked).toContain('perfect-day');
    expect(s.stats.perfectDays).toBe(1);
  });
});

describe('streaks', () => {
  function playDay(s, day) {
    const st = ensureToday(s, day);
    return completeTask(st, st.today.taskIds[0], day).state;
  }

  it('counts consecutive days and unlocks 7-Day Starter', () => {
    let s = startedState();
    for (let i = 0; i < 7; i += 1) s = playDay(s, addDays(DAY, i));
    expect(s.stats.currentStreak).toBe(7);
    expect(s.unlocked['7-day-starter']).toBe(addDays(DAY, 6));
  });

  it('resets after a missed day but keeps the best streak', () => {
    let s = startedState();
    s = playDay(s, DAY);
    s = playDay(s, addDays(DAY, 1));
    s = playDay(s, addDays(DAY, 3)); // skipped one day
    expect(s.stats.currentStreak).toBe(1);
    expect(s.stats.bestStreak).toBe(2);
    expect(displayStreak(s.stats, addDays(DAY, 5))).toBe(0);
  });
});

describe('swap (换一换)', () => {
  it('replaces a task and is limited per day', () => {
    let s = startedState();
    const target = s.today.taskIds[0];
    s = swapTask(s, target, DAY);
    expect(s.today.taskIds).not.toContain(target);
    expect(new Set(s.today.taskIds).size).toBe(s.today.taskIds.length);
    for (let i = 1; i < SWAPS_PER_DAY + 2; i += 1) s = swapTask(s, s.today.taskIds[0], DAY);
    expect(swapsLeft(s)).toBe(0);
    expect(s.today.swapsUsed).toBe(SWAPS_PER_DAY);
  });

  it('does not swap a completed task', () => {
    let s = startedState();
    const id = s.today.taskIds[0];
    s = completeTask(s, id, DAY).state;
    expect(swapTask(s, id, DAY)).toBe(s);
  });
});

describe('helpers', () => {
  it('computes levels and achievement progress', () => {
    expect(levelInfo(0)).toMatchObject({ level: 1, into: 0 });
    expect(levelInfo(23)).toMatchObject({ level: 3, into: 3 });
    const s = { ...createInitialState(), attributes: { beauty: 6, aura: 5, charm: 9, money: 5, power: 7 } };
    expect(conditionValue({ type: 'allAttributes', gte: 5 }, s)).toBe(5);
  });

  it('handles date math across months', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(daysBetween('2026-12-31', '2027-01-02')).toBe(2);
  });
});
