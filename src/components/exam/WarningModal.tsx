import React from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Warning } from '../../types';

interface WarningModalProps {
  warning: Warning | null;
  onContinue: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({ warning, onContinue }) => {
  if (!warning || warning.warningNumber >= 3) return null;

  const isLastWarning = warning.warningNumber === 2;

  return (
    <Modal isOpen={Boolean(warning)} preventBackdropClose maxWidth="480px">
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '2px solid var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--color-warning)',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '14px', color: '#ffffff' }}>
          ⚠️ WARNING {warning.warningNumber}/3
        </h2>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Violation detected:
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', fontSize: '1rem' }}>
            {warning.reason}
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {isLastWarning
              ? 'One more violation will disqualify you from this round.'
              : (warning.message || 'Please remain on the examination page.')}
          </div>
        </div>

        <div
          style={{
            fontSize: '0.82rem',
            color: isLastWarning ? '#ef4444' : 'var(--color-warning)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldAlert size={16} />
          <span>
            {isLastWarning
              ? 'Final Warning: Accumulating 3 warnings results in immediate disqualification.'
              : 'Please remain on the examination page.'}
          </span>
        </div>

        <button
          onClick={onContinue}
          className="btn btn-warning"
          style={{ width: '100%', padding: '12px 24px', fontSize: '1rem', fontWeight: 600 }}
        >
          Continue Exam
        </button>
      </div>
    </Modal>
  );
};
