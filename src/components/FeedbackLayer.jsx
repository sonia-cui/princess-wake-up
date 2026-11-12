import { attributeByKey } from '../data/attributes.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

const achievementById = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

// Floating "+2 Power" gains and achievement toasts. Purely visual:
// the game state is already updated before anything shows here.
export default function FeedbackLayer({ items }) {
  const gains = items.filter((i) => i.kind === 'gain');
  const badges = items.filter((i) => i.kind === 'achievement');
  return (
    <div className="feedback" aria-live="polite">
      <div className="gains">
        {gains.map((g, i) => (
          <span
            key={g.id}
            className="gain"
            style={{ '--c': attributeByKey[g.key].color, '--delay': `${i * 90}ms` }}
          >
            {attributeByKey[g.key].name} +{g.value}
          </span>
        ))}
      </div>
      {badges.map((b) => {
        const a = achievementById[b.achievementId];
        return (
          <div key={b.id} className="toast">
            <span className="toast-mark" aria-hidden="true">
              ✦
            </span>
            <div>
              <p className="toast-label">成就解锁</p>
              <p className="toast-title">
                {a.title} · {a.zh}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
