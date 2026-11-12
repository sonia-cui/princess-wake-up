import { taskById } from '../data/tasks.js';
import { swapsLeft, displayStreak } from '../logic/game.js';
import { formatDateZh, toDateKey } from '../utils/date.js';
import TaskCard from './TaskCard.jsx';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return '夜深了';
  if (h < 11) return '早安';
  if (h < 14) return '午安';
  if (h < 18) return '下午好';
  return '晚上好';
}

// 今日任务页
export default function TodayView({ state, onToggle, onSwap }) {
  const { today, profile, stats } = state;
  const done = today.completedIds.length;
  const total = today.taskIds.length;
  const left = swapsLeft(state);
  const streak = displayStreak(stats, toDateKey());

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">{formatDateZh(today.date)}</p>
        <h1 className="page-title">
          {greeting()}，{profile.nickname}
        </h1>
        <div className="today-summary">
          <div className="today-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done}>
            <div className="today-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <p className="today-count">
            已完成 <strong>{done}</strong> / {total}
            <span className="dot">·</span>
            连续 <strong>{streak}</strong> 天
          </p>
        </div>
      </header>

      {done === total && (
        <p className="banner">今天的任务全部完成。明天见，公主。</p>
      )}

      <ul className="task-list">
        {today.taskIds.map((id) => (
          <TaskCard
            key={id}
            task={taskById[id]}
            done={today.completedIds.includes(id)}
            canSwap={left > 0}
            onToggle={() => onToggle(id)}
            onSwap={() => onSwap(id)}
          />
        ))}
      </ul>
      <p className="hint">今天还能换 {left} 次任务 · 点圆圈完成，再点一次可撤销</p>
    </div>
  );
}
