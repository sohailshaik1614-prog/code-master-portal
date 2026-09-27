import React from 'react';
import { Modal } from '../common/Modal';
import { Ban, ShieldOff } from 'lucide-react';

interface DisqualificationModalProps {
  isOpen: boolean;
  reason?: string;
  roundNumber: 1 | 2;
  onExit: () => void;
}

export const DisqualificationModal: React.FC<DisqualificationModalProps> = ({
  isOpen,
  reason = 'Maximum warning limit reached.',
  roundNumber,
  onExit,
}) => {
  return (
    <Modal isOpen={isOpen} preventBackdropClose maxWidth="480px">
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '2px solid var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--color-danger)',
          }}
        >
          <Ban size={36} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '14px', color: '#ffffff' }}>
          🔴 ROUND DISQUALIFIED
        </h2>

        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            textAlign: 'left',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#fca5a5', textTransform: 'uppercase', marginBottom: '4px' }}>
            Status
          </div>
          <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px', fontSize: '1.05rem' }}>
            Maximum warning limit reached.
          </div>
          <p style={{ fontSize: '0.88rem', color: '#fca5a5', lineHeight: '1.5', margin: '0 0 8px 0' }}>
            You are no longer permitted to continue Round {roundNumber}.
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            {reason ? `Reason: ${reason}` : ''}
          </p>
        </div>

        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldOff size={16} color="#ef4444" />
          <span>Please contact the event administrator.</span>
        </div>

        <button
          onClick={onExit}
          className="btn btn-danger"
          style={{ width: '100%', padding: '12px 24px', fontSize: '1rem', fontWeight: 600 }}
        >
          Exit to Dashboard
        </button>
      </div>
    </Modal>
  );
};
