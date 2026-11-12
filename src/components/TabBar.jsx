const TABS = [
  { key: 'today', label: '今日', icon: 'M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z' },
  { key: 'growth', label: '成长', icon: 'M12 3l8.5 6.2-3.2 10H6.7L3.5 9.2z' },
  { key: 'achievements', label: '成就', icon: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z' },
  { key: 'me', label: '我的', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 21c.8-4 3.8-6 7.5-6s6.7 2 7.5 6' },
];

export default function TabBar({ tab, onChange }) {
  return (
    <nav className="tabbar" aria-label="主导航">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`tab ${tab === t.key ? 'is-on' : ''}`}
          aria-current={tab === t.key ? 'page' : undefined}
          onClick={() => onChange(t.key)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={t.icon} />
          </svg>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
