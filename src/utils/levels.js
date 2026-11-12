import { POINTS_PER_LEVEL } from '../data/attributes.js';

// Level 1 at 0 points, +1 level every POINTS_PER_LEVEL points.
export function levelInfo(points) {
  const level = Math.floor(points / POINTS_PER_LEVEL) + 1;
  const into = points % POINTS_PER_LEVEL;
  return { level, into, needed: POINTS_PER_LEVEL, ratio: into / POINTS_PER_LEVEL };
}

export function formatReward(reward, attributeByKey) {
  return Object.entries(reward).map(([k, v]) => `${attributeByKey[k].name} +${v}`);
}
