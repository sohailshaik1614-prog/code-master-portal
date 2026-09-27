import React from 'react';
import { Modal } from '../common/Modal';
import { AlertCircle, CheckCircle, HelpCircle, BookmarkCheck } from 'lucide-react';

interface SubmissionConfirmModalProps {
  isOpen: boolean;
  roundNumber: 1 | 2;
  attemptedCount: number;
  unansweredCount: number;
  reviewCount?: number;
  onCancel: () => void;
  onConfirmSubmit: () => void;
}

export const SubmissionConfirmModal: React.FC<SubmissionConfirmModalProps> = ({
  isOpen,
  roundNumber,
  attemptedCount,
  unansweredCount,
  reviewCount = 0,
  onCancel,
  onConfirmSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} maxWidth="480px" title="Submit Assessment">
      <div style={{ padding: '4px 0' }}>
        <p style={{ fontSize: '0.92rem', marginBottom: '20px', color: 'var(--text-secondary)' }}>
          Are you sure you want to submit Round {roundNumber}? Once submitted, your answers will be finalized and evaluated. You will not be able to re-enter this round without administrator approval.
        </p>

        {/* Summary Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: reviewCount > 0 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px',
            background: 'rgba(7, 11, 20, 0.7)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#10b981', marginBottom: '4px' }}>
              <CheckCircle size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Attempted</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {attemptedCount}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <HelpCircle size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Unanswered</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 800, color: unansweredCount > 0 ? '#f59e0b' : '#fff' }}>
              {unansweredCount}
            </div>
          </div>

          {reviewCount > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#f59e0b', marginBottom: '4px' }}>
                <BookmarkCheck size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>For Review</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>
                {reviewCount}
              </div>
            </div>
          )}
        </div>

        {unansweredCount > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              fontSize: '0.82rem',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <AlertCircle size={16} />
            <span>You still have {unansweredCount} unanswered questions.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel & Return
          </button>
          <button onClick={onConfirmSubmit} className="btn btn-primary">
            Confirm Final Submission
          </button>
        </div>
      </div>
    </Modal>
  );
};
