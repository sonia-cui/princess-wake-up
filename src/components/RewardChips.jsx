import { attributeByKey } from '../data/attributes.js';

// "+2 Power" chips, coloured by attribute.
export default function RewardChips({ reward }) {
  return (
    <span className="reward-chips">
      {Object.entries(reward).map(([key, value]) => (
        <span key={key} className="reward-chip" style={{ '--c': attributeByKey[key].color }}>
          {attributeByKey[key].name} +{value}
        </span>
      ))}
    </span>
  );
}
