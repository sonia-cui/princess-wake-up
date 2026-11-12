import { TASKS } from '../data/tasks.js';
import { TIME_OPTIONS } from '../data/profileOptions.js';
import { createRng, shuffle } from '../utils/random.js';

// Tasks that fit the user's profile: short enough for the daily time budget,
// and not more expensive than the money budget allows.
export function eligibleTasks(profile, pool = TASKS) {
  return pool.filter((t) => t.minutes <= profile.dailyMinutes && t.cost <= profile.budget);
}

export function tasksPerDay(profile) {
  const option = TIME_OPTIONS.find((o) => o.value === profile.dailyMinutes);
  return option ? option.tasksPerDay : 4;
}

// Pick today's tasks. Deterministic for (profile, date): same input → same list.
// Prefers one task per category so a day mixes body, mind, money and people,
// then fills any remaining slots from what is left.
export function generateDailyTasks(profile, dateKey, pool = TASKS) {
  const rng = createRng(`${profile.createdAt}|${dateKey}`);
  const candidates = shuffle(eligibleTasks(profile, pool), rng);
  const count = Math.min(tasksPerDay(profile), candidates.length);

  const picked = [];
  const usedCategories = new Set();
  for (const task of candidates) {
    if (picked.length >= count) break;
    if (!usedCategories.has(task.category)) {
      picked.push(task.id);
      usedCategories.add(task.category);
    }
  }
  for (const task of candidates) {
    if (picked.length >= count) break;
    if (!picked.includes(task.id)) picked.push(task.id);
  }
  return picked;
}

// Replace one of today's tasks with another eligible task not already on the list.
// Returns the new task id, or null when nothing is left to swap in.
export function pickReplacement(profile, dateKey, currentIds, swapIndex, pool = TASKS) {
  const rng = createRng(`${profile.createdAt}|${dateKey}|swap${swapIndex}`);
  const options = eligibleTasks(profile, pool).filter((t) => !currentIds.includes(t.id));
  if (options.length === 0) return null;
  return options[Math.floor(rng() * options.length)].id;
}
