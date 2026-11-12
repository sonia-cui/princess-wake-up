import { useState } from 'react';
import ChipGroup from './ChipGroup.jsx';
import { STATUS_OPTIONS, TIME_OPTIONS, BUDGET_OPTIONS } from '../data/profileOptions.js';

// 建档页: the profile decides how many tasks a day gets and which ones fit.
// Also used to edit the profile later (initial = existing profile).
export default function Onboarding({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nickname: initial?.nickname ?? '',
    age: initial?.age ?? '',
    status: initial?.status ?? null,
    dailyMinutes: initial?.dailyMinutes ?? null,
    budget: initial?.budget ?? null,
  });
  const [error, setError] = useState('');
  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError('');
  };

  function submit(e) {
    e.preventDefault();
    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 12 || age > 80) return setError('请填写 12–80 之间的年龄');
    if (form.status === null) return setError('选一下你现在的身份');
    if (form.dailyMinutes === null) return setError('选一下每天能投入多少时间');
    if (form.budget === null) return setError('选一下预算');
    onSubmit({ ...form, age });
  }

  return (
    <div className="page onboarding">
      <header className="page-head">
        <p className="eyebrow">{initial ? 'EDIT PROFILE' : 'STEP 1 · 建档'}</p>
        <h1 className="page-title">{initial ? '修改档案' : '先认识一下你'}</h1>
        <p className="page-sub">每日任务会按你的时间和预算来安排。{initial && '修改从明天开始生效。'}</p>
      </header>

      <form className="card form" onSubmit={submit} noValidate>
        <div className="field-row">
          <label className="field">
            <span className="field-label">怎么称呼你</span>
            <input
              className="input"
              type="text"
              maxLength={12}
              placeholder="公主"
              value={form.nickname}
              onChange={(e) => set('nickname')(e.target.value)}
            />
          </label>
          <label className="field field-narrow">
            <span className="field-label">年龄</span>
            <input
              className="input"
              type="number"
              inputMode="numeric"
              min={12}
              max={80}
              placeholder="25"
              value={form.age}
              onChange={(e) => set('age')(e.target.value)}
            />
          </label>
        </div>

        <ChipGroup name="status" label="现在的身份" options={STATUS_OPTIONS} value={form.status} onChange={set('status')} />
        <ChipGroup
          name="time"
          label="每天能投入的时间"
          options={TIME_OPTIONS}
          value={form.dailyMinutes}
          onChange={set('dailyMinutes')}
        />
        <ChipGroup name="budget" label="预算" options={BUDGET_OPTIONS} value={form.budget} onChange={set('budget')} />

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            返回
          </button>
          <button type="submit" className="btn btn-primary">
            {initial ? '保存' : '完成建档'}
          </button>
        </div>
      </form>
    </div>
  );
}
