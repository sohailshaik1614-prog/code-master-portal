import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  count: number | null;
  icon: LucideIcon;
  color?: string;
  hasData?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  count,
  icon: Icon,
  color = '#00f5a0',
  hasData = false,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: `rgba(${color === '#ef4444' ? '239, 68, 68' : color === '#f59e0b' ? '245, 158, 11' : color === '#3b82f6' ? '59, 130, 246' : '0, 245, 160'}, 0.12)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          <Icon size={18} />
        </div>
      </div>

      {hasData && count !== null ? (
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1,
            }}
          >
            {count}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Live tracked participant state
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              fontStyle: 'italic',
            }}
          >
            No data connected
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Connect backend for live metrics
          </div>
        </div>
      )}
    </div>
  );
};
