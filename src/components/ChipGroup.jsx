// Single-choice chip selector (accessible as a radio group).
export default function ChipGroup({ name, label, options, value, onChange }) {
  return (
    <fieldset className="field">
      <legend className="field-label">{label}</legend>
      <div className="chips" role="radiogroup">
        {options.map((o) => (
          <label key={o.value} className={`chip ${value === o.value ? 'is-on' : ''}`}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span>{o.label}</span>
            {o.hint && <small>{o.hint}</small>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
