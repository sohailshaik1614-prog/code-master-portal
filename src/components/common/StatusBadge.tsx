import React from 'react';
import { RoundStatus, ParticipantStatus, ActivityStatus } from '../../types';

interface StatusBadgeProps {
  status: RoundStatus | ParticipantStatus | ActivityStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let badgeClass = 'badge-neutral';
  let dotColor = '#94a3b8';

  const s = status.toLowerCase();

  if (s.includes('live') || s.includes('available') || s.includes('eligible') || s.includes('active') || s.includes('qualified') || s.includes('passed')) {
    badgeClass = 'badge-success';
    dotColor = '#10b981';
  } else if (s.includes('in progress') || s.includes('scheduled') || s.includes('idle')) {
    badgeClass = 'badge-warning';
    dotColor = '#f59e0b';
  } else if (s.includes('disqualified') || s.includes('failed') || s.includes('danger')) {
    badgeClass = 'badge-danger';
    dotColor = '#ef4444';
  } else if (s.includes('completed') || s.includes('submitted')) {
    badgeClass = 'badge-info';
    dotColor = '#0ea5e9';
  } else if (s.includes('locked') || s.includes('ended') || s.includes('not started')) {
    badgeClass = 'badge-neutral';
    dotColor = '#64748b';
  }

  return (
    <span
      className={`badge ${badgeClass}`}
      style={{
        fontSize: size === 'sm' ? '0.72rem' : '0.8rem',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
};
