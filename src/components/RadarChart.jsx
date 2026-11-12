import { ATTRIBUTES } from '../data/attributes.js';

// Pentagon chart of the five attributes. Scale grows with the highest value
// so early progress is still visible.
export default function RadarChart({ attributes, size = 240 }) {
  const c = size / 2;
  const r = size / 2 - 34;
  const max = Math.max(10, ...ATTRIBUTES.map((a) => attributes[a.key]));
  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / ATTRIBUTES.length;
  const point = (i, ratio) => [c + Math.cos(angle(i)) * r * ratio, c + Math.sin(angle(i)) * r * ratio];
  const ring = (ratio) => ATTRIBUTES.map((_, i) => point(i, ratio).join(',')).join(' ');
  const shape = ATTRIBUTES.map((a, i) => point(i, Math.max(0.04, attributes[a.key] / max)).join(',')).join(' ');

  return (
    <svg className="radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="五项属性雷达图">
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <polygon key={t} points={ring(t)} className="radar-ring" />
      ))}
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = point(i, 1);
        return <line key={a.key} x1={c} y1={c} x2={x} y2={y} className="radar-axis" />;
      })}
      <polygon points={shape} className="radar-shape" />
      {ATTRIBUTES.map((a, i) => {
        const [x, y] = point(i, 1.2);
        return (
          <text key={a.key} x={x} y={y} className="radar-label" textAnchor="middle" dominantBaseline="middle" fill={a.color}>
            {a.name}
          </text>
        );
      })}
    </svg>
  );
}
