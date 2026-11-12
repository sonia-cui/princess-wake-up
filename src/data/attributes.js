// The five growth attributes. Order here is the display order everywhere.
// `color` is the accent used for bars, chips and gain feedback.
export const ATTRIBUTES = [
  { key: 'beauty', name: 'Beauty', zh: '美丽', desc: '护肤、睡眠、形象管理', color: '#D98BA0' },
  { key: 'aura', name: 'Aura', zh: '气场', desc: '阅读、思考、独处与内在秩序', color: '#9C8BC4' },
  { key: 'charm', name: 'Charm', zh: '魅力', desc: '社交、表达、对他人的好奇', color: '#E39A7B' },
  { key: 'money', name: 'Money', zh: '财富', desc: '记账、理财、搞钱技能', color: '#BF9B5A' },
  { key: 'power', name: 'Power', zh: '力量', desc: '运动、学习、执行力', color: '#6F9E96' },
];

export const ATTRIBUTE_KEYS = ATTRIBUTES.map((a) => a.key);

export const attributeByKey = Object.fromEntries(ATTRIBUTES.map((a) => [a.key, a]));

// Points needed per level. Level 1 starts at 0 points.
export const POINTS_PER_LEVEL = 10;

export function emptyAttributes() {
  return Object.fromEntries(ATTRIBUTE_KEYS.map((k) => [k, 0]));
}
