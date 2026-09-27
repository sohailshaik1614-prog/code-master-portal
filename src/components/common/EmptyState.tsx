import React from 'react';
import { Database, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  isBackendNote?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'Connect backend to display live competition data.',
  icon,
  actionText,
  onAction,
  isBackendNote = true,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <Database size={28} />}
      </div>
      <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ maxWidth: '440px', marginBottom: isBackendNote || actionText ? '16px' : '0' }}>
        {description}
      </p>

      {isBackendNote && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontSize: '0.82rem',
            color: '#93c5fd',
            marginBottom: actionText ? '16px' : '0',
          }}
        >
          <AlertCircle size={14} />
          <span>Frontend-only architecture: Ready to hook into real REST / WebSocket backend</span>
        </div>
      )}

      {actionText && onAction && (
        <button className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
