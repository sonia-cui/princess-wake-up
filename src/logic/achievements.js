import { ACHIEVEMENTS } from '../data/achievements.js';
import { ATTRIBUTE_KEYS } from '../data/attributes.js';

// Current value a condition is measured against, so the UI can show progress (e.g. 4 / 7).
export function conditionValue(condition, state) {
  const { stats, attributes } = state;
  switch (condition.type) {
    case 'totalCompleted':
      return stats.totalCompleted;
    case 'streak':
      return stats.bestStreak;
    case 'perfectDays':
      return stats.perfectDays;
    case 'attribute':
      return attributes[condition.key] ?? 0;
    case 'allAttributes':
      return Math.min(...ATTRIBUTE_KEYS.map((k) => attributes[k] ?? 0));
    default:
      return 0;
  }
}

export function isMet(condition, state) {
  return conditionValue(condition, state) >= condition.gte;
}

// Ids of achievements that are met now but were not unlocked before.
export function newlyUnlocked(state, list = ACHIEVEMENTS) {
  return list.filter((a) => !state.unlocked[a.id] && isMet(a.condition, state)).map((a) => a.id);
}
