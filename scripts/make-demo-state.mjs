// Builds a demo save (6 days of play) for README screenshots, by running the real game logic.
// Usage: node scripts/make-demo-state.mjs > demo-state.json
import { createInitialState, createProfile, ensureToday, completeTask } from '../src/logic/game.js';
import { addDays, toDateKey } from '../src/utils/date.js';

const today = toDateKey();
const start = addDays(today, -5);
let s = createProfile(createInitialState(), { nickname: '可曼', age: 25, status: 'job-seeking', dailyMinutes: 60, budget: 1 }, start);
for (let i = 0; i <= 5; i += 1) {
  const day = addDays(start, i);
  s = ensureToday(s, day);
  const doCount = i === 5 ? 2 : [5, 3, 4, 5, 3][i];
  for (const id of s.today.taskIds.slice(0, doCount)) s = completeTask(s, id, day).state;
}
process.stdout.write(JSON.stringify(s));
