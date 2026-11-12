import { useState } from 'react';
import { STATUS_OPTIONS, TIME_OPTIONS, BUDGET_OPTIONS } from '../data/profileOptions.js';
import { ATTRIBUTE_KEYS } from '../data/attributes.js';
import { daysBetween, toDateKey } from '../utils/date.js';

const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? '—';

// 我的页: profile, lifetime stats, edit and reset.
export default function ProfileView({ state, onEdit, onReset }) {
  const [confirming, setConfirming] = useState(false);
  const { profile, stats, attributes } = state;
  const totalPoints = ATTRIBUTE_KEYS.reduce((sum, k) => sum + attributes[k], 0);
  const days = daysBetween(profile.createdAt, toDateKey()) + 1;

  const statItems = [
    ['养成天数', days],
    ['累计完成', stats.totalCompleted],
    ['最长连续', `${stats.bestStreak} 天`],
    ['完美的一天', stats.perfectDays],
    ['属性总点数', totalPoints],
  ];

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">ME</p>
        <h1 className="page-title">{profile.nickname}</h1>
        <p className="page-sub">{profile.createdAt.replaceAll('-', '.')} 开始养成</p>
      </header>

      <section className="card">
        <dl className="stats">
          {statItems.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="card">
        <div className="card-head">
          <h2 className="card-title">我的档案</h2>
          <button type="button" className="btn-link" onClick={onEdit}>
            修改
          </button>
        </div>
        <dl className="kv">
          <dt>年龄</dt>
          <dd>{profile.age}</dd>
          <dt>身份</dt>
          <dd>{labelOf(STATUS_OPTIONS, profile.status)}</dd>
          <dt>每日时间</dt>
          <dd>{labelOf(TIME_OPTIONS, profile.dailyMinutes)}</dd>
          <dt>预算</dt>
          <dd>{labelOf(BUDGET_OPTIONS, profile.budget)}</dd>
        </dl>
      </section>

      <section className="card">
        <h2 className="card-title">数据</h2>
        <p className="muted small">所有数据只保存在这台设备的浏览器里，不会上传。</p>
        {confirming ? (
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
              取消
            </button>
            <button type="button" className="btn btn-danger" onClick={onReset}>
              确定清空，重新开始
            </button>
          </div>
        ) : (
          <button type="button" className="btn btn-ghost btn-wide" onClick={() => setConfirming(true)}>
            清空数据
          </button>
        )}
      </section>
    </div>
  );
}
