import { CATEGORIES } from '../data/tasks.js';
import RewardChips from './RewardChips.jsx';

export default function TaskCard({ task, done, canSwap, onToggle, onSwap }) {
  const category = CATEGORIES[task.category];
  return (
    <li className={`task ${done ? 'is-done' : ''}`}>
      <button
        type="button"
        className="task-check"
        aria-pressed={done}
        aria-label={done ? `取消完成：${task.title}` : `完成：${task.title}`}
        onClick={onToggle}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10.5" />
          <path d="M7.5 12.5l3 3 6-6.5" />
        </svg>
      </button>
      <div className="task-body">
        <p className="task-meta">
          <span aria-hidden="true">{category.icon}</span> {category.zh} · 约 {task.minutes} 分钟
        </p>
        <p className="task-title">{task.title}</p>
        <RewardChips reward={task.reward} />
      </div>
      {!done && (
        <button type="button" className="task-swap" disabled={!canSwap} onClick={onSwap} title="换一个任务">
          换一换
        </button>
      )}
    </li>
  );
}
