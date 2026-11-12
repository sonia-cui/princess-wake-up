// Task pool. Every rule about a task lives here as data, not in the UI:
//   category  – grouping shown on the card
//   minutes   – rough time cost; tasks longer than the user's daily budget are skipped
//   cost      – money cost: 0 free, 1 small spend, 2 noticeable spend (matched against profile budget)
//   reward    – attribute gains granted on completion, e.g. { power: 2 }
// The first entries in several categories come from the v0 prototype's templates (see legacy/script.js).

export const CATEGORIES = {
  exercise: { zh: '运动', icon: '◐' },
  reading: { zh: '阅读', icon: '❡' },
  study: { zh: '学习', icon: '✎' },
  tidy: { zh: '整理', icon: '◇' },
  skincare: { zh: '护肤', icon: '✿' },
  social: { zh: '社交', icon: '❀' },
  finance: { zh: '理财', icon: '◎' },
  growth: { zh: '自我提升', icon: '✦' },
};

export const TASKS = [
  // exercise → Power
  { id: 'ex-30min', title: '运动 30 分钟', category: 'exercise', minutes: 30, cost: 0, reward: { power: 2 } },
  { id: 'ex-10k-steps', title: '步行 10000 步', category: 'exercise', minutes: 60, cost: 0, reward: { power: 2, beauty: 1 } },
  { id: 'ex-stretch', title: '睡前拉伸 10 分钟', category: 'exercise', minutes: 10, cost: 0, reward: { power: 1, beauty: 1 } },
  { id: 'ex-class', title: '上一节瑜伽 / 普拉提课', category: 'exercise', minutes: 60, cost: 2, reward: { power: 2, beauty: 1 } },
  { id: 'ex-stairs', title: '今天走楼梯不坐电梯', category: 'exercise', minutes: 5, cost: 0, reward: { power: 1 } },

  // reading → Aura
  { id: 'rd-30min', title: '阅读 30 分钟', category: 'reading', minutes: 30, cost: 0, reward: { aura: 1, power: 1 } },
  { id: 'rd-article', title: '读一篇深度长文并写下一句感想', category: 'reading', minutes: 20, cost: 0, reward: { aura: 1 } },
  { id: 'rd-new-book', title: '去书店挑一本新书', category: 'reading', minutes: 60, cost: 1, reward: { aura: 2 } },

  // study → Power
  { id: 'st-word', title: '学 5 个外语新单词', category: 'study', minutes: 10, cost: 0, reward: { power: 1 } },
  { id: 'st-skill', title: '练习一项新技能 30 分钟', category: 'study', minutes: 30, cost: 0, reward: { power: 2 } },
  { id: 'st-course', title: '看完一节网课并做笔记', category: 'study', minutes: 45, cost: 0, reward: { power: 1, aura: 1 } },

  // tidy → Aura
  { id: 'td-desk', title: '整理书桌，清空桌面', category: 'tidy', minutes: 15, cost: 0, reward: { aura: 1 } },
  { id: 'td-closet', title: '整理衣柜，挑出 3 件不再穿的', category: 'tidy', minutes: 30, cost: 0, reward: { aura: 1, beauty: 1 } },
  { id: 'td-digital', title: '清理手机相册和桌面文件', category: 'tidy', minutes: 15, cost: 0, reward: { aura: 1 } },

  // skincare → Beauty
  { id: 'sk-morning', title: '早晨完整护肤 + 防晒', category: 'skincare', minutes: 10, cost: 0, reward: { beauty: 1 } },
  { id: 'sk-night', title: '晚上卸妆、护肤，11 点前睡', category: 'skincare', minutes: 15, cost: 0, reward: { beauty: 2 } },
  { id: 'sk-mask', title: '敷一次面膜', category: 'skincare', minutes: 20, cost: 1, reward: { beauty: 1 } },
  { id: 'sk-water', title: '喝够 8 杯水', category: 'skincare', minutes: 5, cost: 0, reward: { beauty: 1, power: 1 } },
  { id: 'sk-hair', title: '认真护理一次头发', category: 'skincare', minutes: 20, cost: 1, reward: { beauty: 1 } },

  // social → Charm
  { id: 'so-message', title: '主动联系一位很久没聊的朋友', category: 'social', minutes: 10, cost: 0, reward: { charm: 2 } },
  { id: 'so-compliment', title: '真诚地夸奖一个人', category: 'social', minutes: 5, cost: 0, reward: { charm: 1 } },
  { id: 'so-coffee', title: '约一个人喝咖啡聊聊天', category: 'social', minutes: 60, cost: 1, reward: { charm: 2, aura: 1 } },
  { id: 'so-post', title: '发一条认真写的动态', category: 'social', minutes: 15, cost: 0, reward: { charm: 1 } },

  // finance → Money
  { id: 'fi-ledger', title: '记今天的每一笔账', category: 'finance', minutes: 5, cost: 0, reward: { money: 1 } },
  { id: 'fi-review', title: '复盘本周开销，找出一项可以省的', category: 'finance', minutes: 20, cost: 0, reward: { money: 2 } },
  { id: 'fi-learn', title: '学一个理财概念（如复利、指数基金）', category: 'finance', minutes: 20, cost: 0, reward: { money: 2, aura: 1 } },
  { id: 'fi-save', title: '今天存下一笔钱，哪怕只有 20 元', category: 'finance', minutes: 5, cost: 0, reward: { money: 2 } },

  // growth → mixed
  { id: 'gr-journal', title: '写日记 10 分钟', category: 'growth', minutes: 10, cost: 0, reward: { aura: 1, charm: 1 } },
  { id: 'gr-meditate', title: '冥想 15 分钟', category: 'growth', minutes: 15, cost: 0, reward: { aura: 2 } },
  { id: 'gr-plan', title: '写下明天最重要的 3 件事', category: 'growth', minutes: 10, cost: 0, reward: { power: 1, aura: 1 } },
  { id: 'gr-no-phone', title: '睡前 1 小时不刷手机', category: 'growth', minutes: 60, cost: 0, reward: { beauty: 1, aura: 1 } },
];

export const taskById = Object.fromEntries(TASKS.map((t) => [t.id, t]));
