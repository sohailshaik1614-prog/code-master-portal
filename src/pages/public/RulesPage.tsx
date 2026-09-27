import React from 'react';
import { LogoHeader } from '../../components/common/LogoHeader';
import { ShieldAlert, AlertTriangle, Clock, Award, Laptop, Eye } from 'lucide-react';

interface RulesPageProps {
  onNavigate: (path: string) => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <LogoHeader size="md" showSubtitle={false} align="center" />
        <h1 style={{ fontSize: '2.4rem', marginTop: '16px', marginBottom: '10px' }}>
          Rules & Code of Conduct
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Please carefully review all competition guidelines, proctoring policies, and scoring mechanics before beginning.
        </p>
      </div>

      {/* Device Recommendation Alert */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 20px',
          background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '32px',
        }}
      >
        <Laptop size={24} color="#60a5fa" />
        <div>
          <strong style={{ color: '#fff' }}>Recommended Environment:</strong>
          <span style={{ color: '#93c5fd', marginLeft: '6px' }}>
            For the best examination experience, use a laptop or desktop computer with a modern browser (Chrome, Edge, Firefox). Mobile and tablet screens are discouraged during assessment.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Rule 1: Anti-Cheat & Proctoring */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <ShieldAlert size={22} color="var(--color-danger)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>1. Automated Anti-Cheating Monitoring</h3>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '14px' }}>
            The examination environment continuously monitors browser interactions to safeguard contest integrity. The following behaviors trigger automatic infractions:
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Tab Switching:</strong> Switching tabs or navigating to another application triggers a violation notice.</li>
            <li><strong>Window Blur:</strong> Minimizing the window or clicking outside the assessment boundary triggers an alert.</li>
            <li><strong>Clipboard Actions:</strong> Copying, cutting, or pasting from external sources is prevented and logged.</li>
            <li><strong>Right-Click & Inspect:</strong> Browser context menus and inspect shortcuts (F12, Ctrl+Shift+I) are restricted.</li>
          </ul>
        </div>

        {/* Rule 2: 3-Warning Rule */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <AlertTriangle size={22} color="var(--color-warning)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>2. Three-Warning Disqualification System</h3>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '14px' }}>
            Each participant begins each stage with a clean record (<code style={{ color: '#00f5a0' }}>0/3 Warnings</code>).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'rgba(7, 11, 20, 0.7)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#f59e0b' }}>Warning 1/3:</strong> First warning modal displayed with infraction details. Exam continues upon acknowledgment.
            </div>
            <div style={{ padding: '12px', background: 'rgba(7, 11, 20, 0.7)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#f97316' }}>Warning 2/3:</strong> Final warning notice. Proctor telemetry flagged for active surveillance.
            </div>
            <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <strong style={{ color: '#ef4444' }}>Warning 3/3:</strong> Immediate round termination. Participant is disqualified and the round is locked.
            </div>
          </div>
        </div>

        {/* Rule 3: Tie-Breaker Rule */}
        <div className="glass-card" style={{ borderLeft: '4px solid #00f5a0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Award size={22} color="#00f5a0" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>3. Official Leaderboard Tie-Breaker Logic</h3>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '14px' }}>
            If two or more participants achieve the same total score, rank is determined strictly by the submission timestamp:
          </p>
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 245, 160, 0.08)',
              border: '1px solid rgba(0, 245, 160, 0.25)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              color: '#f8fafc',
            }}
          >
            <div>1. Primary criterion: Highest aggregate score across all rounds.</div>
            <div style={{ marginTop: '6px' }}>
              2. Tie-breaker criterion: The participant with the <strong>earlier recorded submission timestamp</strong> receives the higher ranking.
            </div>
          </div>
        </div>

        {/* Rule 4: Timer & Auto-Submit */}
        <div className="glass-card" style={{ borderLeft: '4px solid #00d9f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Clock size={22} color="#00d9f5" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>4. Automatic Time-Out Submission</h3>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
            When the round timer reaches <strong>00:00:00</strong>, the examination system automatically locks the interface and submits whatever answers or code modifications were currently in progress. Ensure you manage your pace effectively.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={() => onNavigate('/participant/login')} className="btn btn-primary btn-lg">
          I Understand the Rules — Proceed to Login
        </button>
      </div>
    </div>
  );
};
