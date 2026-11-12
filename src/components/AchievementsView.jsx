import { ACHIEVEMENTS } from '../data/achievements.js';
import { conditionValue } from '../logic/achievements.js';

// 成就页: unlocked ones first, locked ones show progress toward the condition.
export default function AchievementsView({ state }) {
  const unlockedCount = ACHIEVEMENTS.filter((a) => state.unlocked[a.id]).length;
  const sorted = [...ACHIEVEMENTS].sort((a, b) => !!state.unlocked[b.id] - !!state.unlocked[a.id]);

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">ACHIEVEMENTS</p>
        <h1 className="page-title">成就</h1>
        <p className="page-sub">
          已解锁 {unlockedCount} / {ACHIEVEMENTS.length}
        </p>
      </header>
      <ul className="badge-grid">
        {sorted.map((a) => {
          const date = state.unlocked[a.id];
          const value = Math.min(conditionValue(a.condition, state), a.condition.gte);
          return (
            <li key={a.id} className={`card badge ${date ? 'is-on' : ''}`}>
              <span className="badge-mark" aria-hidden="true">
                {date ? '✦' : '◌'}
              </span>
              <p className="badge-title">{a.title}</p>
              <p className="badge-zh">{a.zh}</p>
              <p className="badge-desc">{a.desc}</p>
              {date ? (
                <p className="badge-foot">{date.replaceAll('-', '.')} 解锁</p>
              ) : (
                <div className="badge-progress">
                  <div className="bar bar-thin">
                    <div className="bar-fill" style={{ width: `${(value / a.condition.gte) * 100}%` }} />
                  </div>
                  <span>
                    {value} / {a.condition.gte}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
