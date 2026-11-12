// Achievements are declared as data. Each `condition` is evaluated by
// src/logic/achievements.js — add a new achievement by adding an entry here,
// no UI change needed.
//
// Condition types:
//   { type: 'totalCompleted', gte }     – tasks completed, all time
//   { type: 'streak', gte }             – consecutive active days (best streak counts)
//   { type: 'attribute', key, gte }     – one attribute's points
//   { type: 'allAttributes', gte }      – every attribute at least this many points
//   { type: 'perfectDays', gte }        – days on which every task was completed

export const ACHIEVEMENTS = [
  {
    id: 'first-step',
    title: 'First Step',
    zh: '第一步',
    desc: '完成第一个任务',
    condition: { type: 'totalCompleted', gte: 1 },
  },
  {
    id: 'wake-up-call',
    title: 'Wake-Up Call',
    zh: '起床成功',
    desc: '连续 3 天完成任务',
    condition: { type: 'streak', gte: 3 },
  },
  {
    id: '7-day-starter',
    title: '7-Day Starter',
    zh: '七日开局',
    desc: '连续 7 天完成任务',
    condition: { type: 'streak', gte: 7 },
  },
  {
    id: 'perfect-day',
    title: 'Perfect Day',
    zh: '完美的一天',
    desc: '某一天完成全部任务',
    condition: { type: 'perfectDays', gte: 1 },
  },
  {
    id: 'beauty-builder',
    title: 'Beauty Builder',
    zh: '美丽养成中',
    desc: 'Beauty 达到 10',
    condition: { type: 'attribute', key: 'beauty', gte: 10 },
  },
  {
    id: 'aura-glow',
    title: 'Aura Glow',
    zh: '气场全开',
    desc: 'Aura 达到 10',
    condition: { type: 'attribute', key: 'aura', gte: 10 },
  },
  {
    id: 'charm-era',
    title: 'Charm Era',
    zh: '魅力时代',
    desc: 'Charm 达到 10',
    condition: { type: 'attribute', key: 'charm', gte: 10 },
  },
  {
    id: 'money-minded',
    title: 'Money Minded',
    zh: '搞钱脑',
    desc: 'Money 达到 10',
    condition: { type: 'attribute', key: 'money', gte: 10 },
  },
  {
    id: 'power-up',
    title: 'Power Up',
    zh: '力量觉醒',
    desc: 'Power 达到 10',
    condition: { type: 'attribute', key: 'power', gte: 10 },
  },
  {
    id: 'habit-collector',
    title: 'Habit Collector',
    zh: '习惯收集家',
    desc: '累计完成 30 个任务',
    condition: { type: 'totalCompleted', gte: 30 },
  },
  {
    id: 'balanced-princess',
    title: 'Balanced Princess',
    zh: '六边形公主',
    desc: '五项属性都达到 5',
    condition: { type: 'allAttributes', gte: 5 },
  },
];
