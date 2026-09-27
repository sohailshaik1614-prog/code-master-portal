import React from 'react';
import { LogoHeader } from '../../components/common/LogoHeader';
import { useEvent } from '../../context/EventContext';
import { Calendar, Clock, Award, Shield, CheckCircle2, ChevronRight, UserCheck } from 'lucide-react';

interface EventInfoPageProps {
  onNavigate: (path: string) => void;
}

export const EventInfoPage: React.FC<EventInfoPageProps> = ({ onNavigate }) => {
  const { eventSchedule } = useEvent();

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <LogoHeader size="md" showSubtitle={false} align="center" />
        <h1 style={{ fontSize: '2.4rem', marginTop: '16px', marginBottom: '10px' }}>
          Event Structure & Guidelines
        </h1>
        <p style={{ maxWidth: '640px', margin: '0 auto', color: 'var(--text-secondary)' }}>
          CODEMASTERS is organized by the Coding Club, Department of CSE(AIML), Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology.
        </p>
      </div>

      {/* Timeline Schedule Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
        }}
      >
        {/* Round 1 Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#00d9f5',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              ROUND 01 • MCQ CHALLENGE
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 217, 245, 0.12)',
                color: '#00d9f5',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {eventSchedule.round1DurationMinutes} MINS
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
            Core Concepts & Algorithmic MCQ
          </h3>

          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
            Participants solve multiple-choice algorithmic questions testing theoretical CS knowledge, complexity analysis, data structures, and Python language nuances.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#00d9f5" />
              <span>Configured Window: 10:30 AM — 11:30 AM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#00d9f5" />
              <span>Scoring: Positive marks for correct answers, negative marks for incorrect options</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="#00d9f5" />
              <span>Monitored: Full proctoring active with 3-warning lockout</span>
            </div>
          </div>
        </div>

        {/* Round 2 Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#00f5a0',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              ROUND 02 • PYTHON DEBUGGING
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 245, 160, 0.12)',
                color: '#00f5a0',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {eventSchedule.round2DurationMinutes} MINS
            </span>
          </div>

          <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }}>
            Live Code Debugging & Test Suites
          </h3>

          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
            Inspect pre-loaded intentionally defective Python programs, isolate syntax or logical regressions, modify the source code, and run automated verification tests.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#00f5a0" />
              <span>Configured Window: 01:00 PM — 02:30 PM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#00f5a0" />
              <span>Scoring: Scaled by public & confidential hidden test cases passed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} color="#00f5a0" />
              <span>Eligibility: Requires Round 1 qualification benchmark</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(13, 20, 36, 0.9) 100%)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
        }}
      >
        <h3 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Ready to Compete?</h3>
        <p style={{ maxWidth: '520px', margin: '0 auto 24px', color: 'var(--text-secondary)' }}>
          Review the competition rules or log in with your Vel Tech student email to enter the assessment lobby.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('/participant/login')} className="btn btn-primary">
            Participant Login
            <ChevronRight size={16} />
          </button>
          <button onClick={() => onNavigate('/rules')} className="btn btn-secondary">
            View Competition Rules
          </button>
        </div>
      </div>
    </div>
  );
};
