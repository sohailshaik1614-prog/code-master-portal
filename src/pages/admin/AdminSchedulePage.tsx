import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { RoundStatus } from '../../types';
import { CalendarClock, Save, CheckCircle2, Play, Lock, AlertCircle } from 'lucide-react';

export const AdminSchedulePage: React.FC = () => {
  const { eventSchedule, updateSchedule } = useEvent();

  // Round 1 form states
  const [r1Start, setR1Start] = useState(eventSchedule.round1Start || '2026-09-29T10:30');
  const [r1End, setR1End] = useState(eventSchedule.round1End || '2026-09-29T11:30');
  const [r1Duration, setR1Duration] = useState<number>(eventSchedule.round1DurationMinutes || 60);
  const [r1Status, setR1Status] = useState<RoundStatus>(eventSchedule.round1Status || 'Available');

  // Round 2 form states
  const [r2Start, setR2Start] = useState(eventSchedule.round2Start || '2026-09-29T13:00');
  const [r2End, setR2End] = useState(eventSchedule.round2End || '2026-09-29T14:30');
  const [r2Duration, setR2Duration] = useState<number>(eventSchedule.round2DurationMinutes || 90);
  const [r2Status, setR2Status] = useState<RoundStatus>(eventSchedule.round2Status || 'Locked');

  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchedule({
      round1Start: r1Start,
      round1End: r1End,
      round1DurationMinutes: r1Duration,
      round1Status: r1Status,
      round2Start: r2Start,
      round2End: r2End,
      round2DurationMinutes: r2Duration,
      round2Status: r2Status,
    });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleQuickStatus = (round: 1 | 2, status: RoundStatus) => {
    if (round === 1) {
      setR1Status(status);
      updateSchedule({ round1Status: status });
    } else {
      setR2Status(status);
      updateSchedule({ round2Status: status });
    }
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Event Schedule & Round Timers</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Configure live start/end timestamps, assessment countdown durations, and manual state overrides.
        </p>
      </div>

      {savedNotification && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 18px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            color: '#10b981',
            marginBottom: '24px',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>Schedule configuration successfully synchronized with participant lobbies.</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '24px',
            marginBottom: '28px',
          }}
        >
          {/* Round 1 Configuration Card */}
          <div className="glass-card" style={{ borderTop: '4px solid #00d9f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarClock size={20} color="#00d9f5" />
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Round 1 — MCQ Challenge</h3>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 217, 245, 0.1)',
                  color: '#00d9f5',
                  fontWeight: 700,
                }}
              >
                Current: {r1Status}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r1Start">Start Date & Time</label>
              <input
                id="r1Start"
                type="datetime-local"
                className="form-input"
                value={r1Start}
                onChange={(e) => setR1Start(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r1End">End Date & Time</label>
              <input
                id="r1End"
                type="datetime-local"
                className="form-input"
                value={r1End}
                onChange={(e) => setR1End(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r1Dur">Duration (Minutes)</label>
              <input
                id="r1Dur"
                type="number"
                min="5"
                max="300"
                className="form-input"
                value={r1Duration}
                onChange={(e) => setR1Duration(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r1Stat">Round Operational Status</label>
              <select
                id="r1Stat"
                className="form-select"
                value={r1Status}
                onChange={(e) => setR1Status(e.target.value as RoundStatus)}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Available">Available (Open for Entry)</option>
                <option value="Live">Live (In Session)</option>
                <option value="Ended">Ended (Closed)</option>
                <option value="Locked">Locked</option>
              </select>
            </div>

            {/* Quick Status Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => handleQuickStatus(1, 'Available')}
                className="btn btn-outline btn-sm"
                style={{ color: '#00f5a0' }}
              >
                <Play size={13} />
                Manually Open R1
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatus(1, 'Locked')}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444' }}
              >
                <Lock size={13} />
                Manually Lock R1
              </button>
            </div>
          </div>

          {/* Round 2 Configuration Card */}
          <div className="glass-card" style={{ borderTop: '4px solid #00f5a0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarClock size={20} color="#00f5a0" />
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Round 2 — Python Debugging</h3>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 245, 160, 0.1)',
                  color: '#00f5a0',
                  fontWeight: 700,
                }}
              >
                Current: {r2Status}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r2Start">Start Date & Time</label>
              <input
                id="r2Start"
                type="datetime-local"
                className="form-input"
                value={r2Start}
                onChange={(e) => setR2Start(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r2End">End Date & Time</label>
              <input
                id="r2End"
                type="datetime-local"
                className="form-input"
                value={r2End}
                onChange={(e) => setR2End(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r2Dur">Duration (Minutes)</label>
              <input
                id="r2Dur"
                type="number"
                min="5"
                max="300"
                className="form-input"
                value={r2Duration}
                onChange={(e) => setR2Duration(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="r2Stat">Round Operational Status</label>
              <select
                id="r2Stat"
                className="form-select"
                value={r2Status}
                onChange={(e) => setR2Status(e.target.value as RoundStatus)}
              >
                <option value="Locked">Locked (Awaiting Qualifications)</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Available">Available (Open for Entry)</option>
                <option value="Live">Live (In Session)</option>
                <option value="Ended">Ended (Closed)</option>
              </select>
            </div>

            {/* Quick Status Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => handleQuickStatus(2, 'Available')}
                className="btn btn-outline btn-sm"
                style={{ color: '#00f5a0' }}
              >
                <Play size={13} />
                Manually Open R2
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatus(2, 'Locked')}
                className="btn btn-outline btn-sm"
                style={{ color: '#ef4444' }}
              >
                <Lock size={13} />
                Manually Lock R2
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} />
            Save Schedule & Timers
          </button>
        </div>
      </form>
    </div>
  );
};
