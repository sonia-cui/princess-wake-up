// 启动页: the "公主，请起床！" wake-up moment. A sun rises behind the title on load.
export default function Landing({ onStart, returning }) {
  return (
    <div className="landing">
      <div className="landing-sun" aria-hidden="true" />
      <div className="landing-inner">
        <p className="eyebrow">A SELF-GROWTH GAME</p>
        <h1 className="landing-title">公主，请起床！</h1>
        <p className="landing-en">PRINCESS, WAKE UP!</p>
        <p className="landing-tagline">开始养成更高配的自己。</p>
        <button type="button" className="btn btn-primary btn-wide" onClick={onStart}>
          {returning ? '继续养成' : '开始养成'}
        </button>
        <p className="landing-attrs" aria-label="五项属性">
          Beauty · Aura · Charm · Money · Power
        </p>
      </div>
    </div>
  );
}
