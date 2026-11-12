// Game rules as pure functions: (state, input, today) → new state.
// No React, no DOM, no localStorage here — which is what makes them unit-testable.

import { emptyAttributes } from '../data/attributes.js';
import { taskById } from '../data/tasks.js';
import { SWAPS_PER_DAY } from '../data/profileOptions.js';
import { generateDailyTasks, pickReplacement } from './taskEngine.js';
import { newlyUnlocked } from './achievements.js';
import { addDays, daysBetween } from '../utils/date.js';

export function createInitialState() {
  return {
    version: 1,
    profile: null,
    attributes: emptyAttributes(),
    stats: {
      totalCompleted: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      perfectDays: 0,
      lastPerfectDate: null,
    },
    today: null, // { date, taskIds, completedIds, swapsUsed }
    history: {}, // { 'YYYY-MM-DD': tasks completed that day }
    unlocked: {}, // { achievementId: 'YYYY-MM-DD' }
  };
}

export function createProfile(state, input, today) {
  const profile = {
    nickname: input.nickname?.trim() || '公主',
    age: input.age,
    status: input.status,
    dailyMinutes: input.dailyMinutes,
    budget: input.budget,
    createdAt: state.profile?.createdAt ?? today,
  };
  // Editing the profile later keeps today's list; the new settings apply from tomorrow.
  return ensureToday({ ...state, profile }, today);
}

// Make sure `state.today` belongs to `today`; start a fresh day otherwise.
export function ensureToday(state, today) {
  if (!state.profile) return state;
  if (state.today && state.today.date === today) return state;
  return {
    ...state,
    today: {
      date: today,
      taskIds: generateDailyTasks(state.profile, today),
      completedIds: [],
      swapsUsed: 0,
    },
  };
}

// Streak shown to the user: it breaks once a whole day passes with nothing completed.
export function displayStreak(stats, today) {
  if (!stats.lastActiveDate) return 0;
  return daysBetween(stats.lastActiveDate, today) <= 1 ? stats.currentStreak : 0;
}

function applyReward(attributes, reward, sign) {
  const next = { ...attributes };
  for (const [key, value] of Object.entries(reward)) {
    next[key] = Math.max(0, (next[key] ?? 0) + sign * value);
  }
  return next;
}

// Complete one of today's tasks.
// Returns { state, gains, unlocked } so the UI can show "+2 Power" and new achievements.
export function completeTask(state, taskId, today) {
  const day = state.today;
  if (!day || day.date !== today || !day.taskIds.includes(taskId) || day.completedIds.includes(taskId)) {
    return { state, gains: {}, unlocked: [] };
  }
  const task = taskById[taskId];
  const completedIds = [...day.completedIds, taskId];

  const stats = { ...state.stats, totalCompleted: state.stats.totalCompleted + 1 };
  if (stats.lastActiveDate !== today) {
    stats.currentStreak = stats.lastActiveDate === addDays(today, -1) ? stats.currentStreak + 1 : 1;
    stats.lastActiveDate = today;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
  }
  if (completedIds.length === day.taskIds.length && stats.lastPerfectDate !== today) {
    stats.perfectDays += 1;
    stats.lastPerfectDate = today;
  }

  let next = {
    ...state,
    attributes: applyReward(state.attributes, task.reward, 1),
    stats,
    today: { ...day, completedIds },
    history: { ...state.history, [today]: (state.history[today] ?? 0) + 1 },
  };

  const unlocked = newlyUnlocked(next);
  if (unlocked.length) {
    next = { ...next, unlocked: { ...next.unlocked, ...Object.fromEntries(unlocked.map((id) => [id, today])) } };
  }
  return { state: next, gains: task.reward, unlocked };
}

// Undo a completion made by mistake. Points and counters go back;
// streaks and already-unlocked achievements are kept (they were earned that day).
export function undoTask(state, taskId, today) {
  const day = state.today;
  if (!day || day.date !== today || !day.completedIds.includes(taskId)) return state;
  const task = taskById[taskId];
  return {
    ...state,
    attributes: applyReward(state.attributes, task.reward, -1),
    stats: { ...state.stats, totalCompleted: Math.max(0, state.stats.totalCompleted - 1) },
    today: { ...day, completedIds: day.completedIds.filter((id) => id !== taskId) },
    history: { ...state.history, [today]: Math.max(0, (state.history[today] ?? 1) - 1) },
  };
}

export function swapsLeft(state) {
  return state.today ? SWAPS_PER_DAY - state.today.swapsUsed : 0;
}

// 换一换: replace an unfinished task. Limited to SWAPS_PER_DAY per day.
export function swapTask(state, taskId, today) {
  const day = state.today;
  if (!day || day.date !== today || day.completedIds.includes(taskId) || swapsLeft(state) <= 0) return state;
  const replacement = pickReplacement(state.profile, today, day.taskIds, day.swapsUsed);
  if (!replacement) return state;
  return {
    ...state,
    today: {
      ...day,
      taskIds: day.taskIds.map((id) => (id === taskId ? replacement : id)),
      swapsUsed: day.swapsUsed + 1,
    },
  };
}
