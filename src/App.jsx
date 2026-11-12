import { useState } from 'react';
import { useGame } from './state/useGame.js';
import Landing from './components/Landing.jsx';
import Onboarding from './components/Onboarding.jsx';
import TodayView from './components/TodayView.jsx';
import GrowthView from './components/GrowthView.jsx';
import AchievementsView from './components/AchievementsView.jsx';
import ProfileView from './components/ProfileView.jsx';
import TabBar from './components/TabBar.jsx';
import FeedbackLayer from './components/FeedbackLayer.jsx';

// Screens: landing → onboarding (first visit) → tabs (今日 / 成长 / 成就 / 我的).
export default function App() {
  const game = useGame();
  const { state } = game;
  // Every visit opens on the wake-up screen (the brand moment); returning users see "继续养成".
  const [screen, setScreen] = useState('landing');
  const [tab, setTab] = useState('today');
  const [editing, setEditing] = useState(false);

  if (screen === 'landing') {
    return <Landing returning={!!state.profile} onStart={() => setScreen(state.profile ? 'tabs' : 'onboarding')} />;
  }

  if (screen === 'onboarding' || editing) {
    return (
      <Onboarding
        initial={state.profile}
        onCancel={editing ? () => setEditing(false) : () => setScreen('landing')}
        onSubmit={(input) => {
          game.saveProfile(input);
          setEditing(false);
          setScreen('tabs');
          setTab('today');
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {tab === 'today' && <TodayView state={state} onToggle={game.toggleTask} onSwap={game.swap} />}
        {tab === 'growth' && <GrowthView state={state} />}
        {tab === 'achievements' && <AchievementsView state={state} />}
        {tab === 'me' && (
          <ProfileView
            state={state}
            onEdit={() => setEditing(true)}
            onReset={() => {
              game.reset();
              setScreen('landing');
              setTab('today');
            }}
          />
        )}
      </main>
      <TabBar tab={tab} onChange={setTab} />
      <FeedbackLayer items={game.feedback} />
    </div>
  );
}
