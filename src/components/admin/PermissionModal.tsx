import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Participant } from '../../types';
import { ShieldCheck } from 'lucide-react';

interface PermissionModalProps {
  isOpen: boolean;
  participant: Participant | null;
  roundNumber: 1 | 2;
  actionType: 're-enable' | 'unlock-submission' | 'reset-warnings' | 'qualify';
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  participant,
  roundNumber,
  actionType,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!participant) return null;

  const getActionTitle = () => {
    switch (actionType) {
      case 're-enable': return 'Re-enable Participant';
      case 'unlock-submission': return 'Unlock Submission for Re-entry';
      case 'reset-warnings': return 'Reset Infraction Warnings';
      case 'qualify': return 'Grant Round 2 Qualification';
    }
  };

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide an administrative reason for this override.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getActionTitle()} maxWidth="500px">
      <div style={{ padding: '6px 0' }}>
        {/* Participant Details Box */}
        <div
          style={{
            background: 'rgba(7, 11, 20, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Participant</div>
              <div style={{ fontWeight: 600, color: '#fff' }}>{participant.fullName}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>VTU Number</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00f5a0' }}>{participant.vtuNumber}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Round</div>
              <div style={{ fontWeight: 600, color: '#00d9f5' }}>Round {roundNumber}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Current Warnings</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: participant.warningsCount >= 2 ? '#ef4444' : '#f59e0b' }}>
                {participant.warningsCount}/3
              </div>
            </div>
          </div>
        </div>

        {/* Reason Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="overrideReason">
            Administrative Justification / Reason *
          </label>
          <textarea
            id="overrideReason"
            className="form-textarea"
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Verified technical network glitch; proctor approved re-entry"
          />
          {error && <div className="form-error">{error}</div>}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn btn-primary">
            <ShieldCheck size={16} />
            Confirm Override
          </button>
        </div>
      </div>
    </Modal>
  );
};
