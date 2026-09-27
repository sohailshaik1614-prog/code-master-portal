import React from 'react';
import { RoundStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { ArrowRight, Lock, CheckCircle2, AlertTriangle, Play, HelpCircle, Code2 } from 'lucide-react';

interface RoundCardProps {
  roundNumber: 1 | 2;
  title: string;
  type: string;
  description: string;
  status: RoundStatus;
  score: number | null;
  maxScore?: number;
  durationMinutes: number;
  warningsCount: number;
  canEnter: boolean;
  lockReason?: string;
  onEnter: () => void;
}

export const RoundCard: React.FC<RoundCardProps> = ({
  roundNumber,
  title,
  type,
  description,
  status,
  score,
  maxScore = 100,
  durationMinutes,
  warningsCount,
  canEnter,
  lockReason,
  onEnter,
}) => {
  const isCompleted = status === 'Completed';
  const isDisqualified = status === 'Disqualified';
  const isLocked = status === 'Locked';
  const isAvailable = status === 'Available' || status === 'In Progress';

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        border: isAvailable
          ? '1px solid rgba(0, 245, 160, 0.3)'
          : isDisqualified
          ? '1px solid rgba(239, 68, 68, 0.4)'
          : '1px solid var(--border-subtle)',
        boxShadow: isAvailable ? 'var(--shadow-md), 0 0 20px rgba(0, 245, 160, 0.08)' : 'var(--shadow-md)',
      }}
    >
      {/* Top Banner Stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: isDisqualified
            ? 'var(--color-danger)'
            : isCompleted
            ? 'var(--color-info)'
            : isAvailable
            ? 'linear-gradient(90deg, #00f5a0, #00d9f5)'
            : 'var(--text-muted)',
        }}
      />

      <div>
        {/* Header Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: roundNumber === 1 ? 'rgba(0, 217, 245, 0.12)' : 'rgba(0, 245, 160, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: roundNumber === 1 ? '#00d9f5' : '#00f5a0',
              }}
            >
              {roundNumber === 1 ? <HelpCircle size={22} /> : <Code2 size={22} />}
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                ROUND 0{roundNumber} • {type}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <p style={{ fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.6' }}>
          {description}
        </p>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '20px',
            background: 'rgba(7, 11, 20, 0.6)',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duration</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
              {durationMinutes} mins
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: score !== null ? '#00f5a0' : 'var(--text-muted)', marginTop: '2px' }}>
              {score !== null ? `${score} / ${maxScore}` : 'Pending'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Warnings</div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: warningsCount >= 2 ? 'var(--color-danger)' : warningsCount === 1 ? 'var(--color-warning)' : '#10b981',
                marginTop: '2px',
              }}
            >
              {warningsCount}/3
            </div>
          </div>
        </div>

        {/* Lock or Disqualification Note */}
        {lockReason && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: isDisqualified ? 'rgba(239, 68, 68, 0.1)' : 'rgba(30, 41, 59, 0.5)',
              border: isDisqualified ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-subtle)',
              marginBottom: '20px',
              fontSize: '0.82rem',
              color: isDisqualified ? '#fca5a5' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isDisqualified ? <AlertTriangle size={16} /> : <Lock size={16} />}
            <span>{lockReason}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div>
        {isCompleted ? (
          <button
            onClick={onEnter}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <CheckCircle2 size={16} color="#00f5a0" />
            Review Submission
          </button>
        ) : isDisqualified ? (
          <button
            disabled
            className="btn btn-danger"
            style={{ width: '100%', opacity: 0.6 }}
          >
            <AlertTriangle size={16} />
            Round Disqualified
          </button>
        ) : isLocked ? (
          <button
            disabled
            className="btn btn-secondary"
            style={{ width: '100%', opacity: 0.5 }}
          >
            <Lock size={16} />
            Round Locked
          </button>
        ) : (
          <button
            onClick={onEnter}
            disabled={!canEnter}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Play size={16} fill="currentColor" />
            {status === 'In Progress' ? `Resume Round ${roundNumber}` : `Enter Round ${roundNumber}`}
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
