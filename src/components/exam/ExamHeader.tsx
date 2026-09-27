import React from 'react';
import { ShieldAlert, Send } from 'lucide-react';

interface ExamHeaderProps {
  roundNumber: 1 | 2;
  roundTitle: string;
  formattedTime: string;
  isLowTime: boolean;
  warningsCount: number;
  maxWarnings?: number;
  totalQuestions?: number;
  currentIndex?: number;
  disabled?: boolean;
  onSubmitClick: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  roundNumber,
  roundTitle,
  formattedTime,
  isLowTime,
  warningsCount,
  maxWarnings = 3,
  totalQuestions,
  currentIndex,
  disabled = false,
  onSubmitClick,
}) => {
  return (
    <header className="exam-header">
      {/* Brand & Round Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <img src="/assets/veltech_logo.jpg" alt="Vel Tech" style={{ height: '24px' }} />
          <img src="/assets/coding_club_logo.jpg" alt="Coding Club" style={{ height: '24px' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#00f5a0',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              ROUND {roundNumber}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {roundTitle}
            </span>
          </div>
          {totalQuestions !== undefined && currentIndex !== undefined && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          )}
        </div>
      </div>

      {/* Center: Authoritative Visible Countdown Timer */}
      <div className={`exam-timer-box ${isLowTime ? 'timer-warning' : ''}`}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
          TIME REMAINING:
        </span>
        <span>{formattedTime}</span>
      </div>

      {/* Right: Anti-Cheat Warning Badge & Submit Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: warningsCount >= 2 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.12)',
            border: warningsCount >= 2 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: warningsCount >= 2 ? 'var(--color-danger)' : warningsCount === 1 ? 'var(--color-warning)' : '#10b981',
          }}
        >
          <ShieldAlert size={16} />
          <span>WARNINGS: {warningsCount}/{maxWarnings}</span>
        </div>

        <button
          onClick={onSubmitClick}
          disabled={disabled}
          className="btn btn-primary btn-sm"
          style={{
            boxShadow: disabled ? 'none' : '0 2px 10px rgba(0, 245, 160, 0.3)',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Send size={15} />
          Submit Assessment
        </button>
      </div>
    </header>
  );
};
