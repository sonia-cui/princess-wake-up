import { ATTRIBUTES } from '../data/attributes.js';
import { levelInfo } from '../utils/levels.js';
import { addDays, toDateKey } from '../utils/date.js';
import RadarChart from './RadarChart.jsx';

// 成长页: attribute levels plus the last 7 days of completed tasks.
export default function GrowthView({ state }) {
  const { attributes, history } = state;
  const today = toDateKey();
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const peak = Math.max(1, ...week.map((d) => history[d] ?? 0));

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">GROWTH</p>
        <h1 className="page-title">我的成长</h1>
      </header>

      <section className="card radar-card">
        <RadarChart attributes={attributes} />
      </section>

      <ul className="attr-list">
        {ATTRIBUTES.map((a) => {
          const points = attributes[a.key];
          const lv = levelInfo(points);
          return (
            <li key={a.key} className="card attr" style={{ '--c': a.color }}>
              <div className="attr-top">
                <p className="attr-name">
                  {a.name} <span>{a.zh}</span>
                </p>
                <p className="attr-level">Lv.{lv.level}</p>
              </div>
              <div className="bar">
                <div className="bar-fill" style={{ width: `${lv.ratio * 100}%` }} />
              </div>
              <p className="attr-foot">
                <span>{a.desc}</span>
                <span>
                  {points} 点 · 距下一级 {lv.needed - lv.into}
                </span>
              </p>
            </li>
          );
        })}
      </ul>

      <section className="card">
        <h2 className="card-title">最近 7 天</h2>
        <div className="week" role="img" aria-label="最近 7 天每天完成的任务数">
          {week.map((d) => {
            const n = history[d] ?? 0;
            return (
              <div key={d} className="week-col">
                <span className="week-n">{n || ''}</span>
                <div className="week-bar" style={{ height: `${(n / peak) * 100}%` }} />
                <span className="week-d">{Number(d.slice(8))}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
