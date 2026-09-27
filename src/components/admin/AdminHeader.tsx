import React from 'react';
import { Shield, Bell, Clock } from 'lucide-react';
import { useEvent } from '../../context/EventContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { currentAdmin, eventSchedule } = useEvent();

  return (
    <header
      style={{
        height: '70px',
        background: 'rgba(7, 11, 20, 0.9)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Round State Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Clock size={14} color="#00f5a0" />
          <span style={{ color: 'var(--text-muted)' }}>R1:</span>
          <span style={{ color: '#00f5a0', fontWeight: 700 }}>{eventSchedule.round1Status}</span>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>R2:</span>
          <span style={{ color: '#00d9f5', fontWeight: 700 }}>{eventSchedule.round2Status}</span>
        </div>

        {/* Admin Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <Shield size={16} color="#3b82f6" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#93c5fd' }}>
            {currentAdmin?.username || 'Super Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};
