// Options shown on the onboarding (建档) page.
// `dailyMinutes` decides how many tasks a day gets and which tasks fit;
// `budget` decides which paid tasks may appear (matched against task.cost).

export const STATUS_OPTIONS = [
  { value: 'student', label: '学生' },
  { value: 'job-seeking', label: '求职中' },
  { value: 'working', label: '上班族' },
  { value: 'freelance', label: '自由职业' },
  { value: 'other', label: '其他' },
];

export const TIME_OPTIONS = [
  { value: 15, label: '15 分钟', tasksPerDay: 3 },
  { value: 30, label: '30 分钟', tasksPerDay: 4 },
  { value: 60, label: '1 小时', tasksPerDay: 5 },
  { value: 120, label: '2 小时以上', tasksPerDay: 6 },
];

export const BUDGET_OPTIONS = [
  { value: 0, label: '零预算', hint: '只给免费任务' },
  { value: 1, label: '小预算', hint: '偶尔花点小钱' },
  { value: 2, label: '舒适预算', hint: '可以为自己投资' },
];

// How many times a day the user may swap a task for another one (换一换).
export const SWAPS_PER_DAY = 3;
