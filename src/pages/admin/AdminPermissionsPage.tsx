import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { PermissionModal } from '../../components/admin/PermissionModal';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Participant } from '../../types';
import { KeyRound, ShieldAlert, Unlock, UserCheck, RotateCcw, AlertTriangle } from 'lucide-react';

export const AdminPermissionsPage: React.FC = () => {
  const {
    participants,
    reEnableParticipant,
    resetParticipantWarnings,
    unlockSubmission,
    qualifyParticipant,
    adminPermissions,
  } = useEvent();

  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [modalAction, setModalAction] = useState<'re-enable' | 'unlock-submission' | 'reset-warnings' | 'qualify'>('re-enable');
  const [targetRound, setTargetRound] = useState<1 | 2>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenAction = (p: Participant, action: typeof modalAction, round: 1 | 2 = 1) => {
    setSelectedParticipant(p);
    setModalAction(action);
    setTargetRound(round);
    setIsModalOpen(true);
  };

  const handleModalConfirm = (reason: string) => {
    if (!selectedParticipant) return;
    if (modalAction === 're-enable') {
      reEnableParticipant(selectedParticipant.id, targetRound, reason);
    } else if (modalAction === 'unlock-submission') {
      unlockSubmission(selectedParticipant.id, targetRound);
    } else if (modalAction === 'reset-warnings') {
      resetParticipantWarnings(selectedParticipant.id);
    } else if (modalAction === 'qualify') {
      qualifyParticipant(selectedParticipant.id);
    }
  };

  const activeOverrides = Object.values(adminPermissions);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Round Access Control & Overrides</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Grant special entry permits, unlock accidental submissions, and re-enable candidates disqualified by warnings.
        </p>
      </div>

      {/* Granted Overrides Log */}
      {activeOverrides.length > 0 && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '28px' }}>
          <h4 style={{ color: '#00f5a0', marginBottom: '12px' }}>Active Administrative Overrides Granted</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeOverrides.map((ov, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(7,11,20,0.8)', borderRadius: '6px', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: '#fff' }}>{ov.vtuNumber}</strong> — Round 0{ov.roundNumber} Override
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reason: {ov.reason}</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                  Granted by {ov.grantedBy} ({new Date(ov.grantedAt || '').toLocaleTimeString()})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participants Table for Overrides */}
      {participants.length === 0 ? (
        <EmptyState
          title="No candidates registered for override control"
          description="Candidates must be registered to grant individual administrative round overrides or resets."
          icon={<KeyRound size={36} color="var(--text-muted)" />}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>VTU Number</th>
                <th>Status</th>
                <th>Warnings</th>
                <th>Round 1 Control</th>
                <th>Round 2 Control</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{p.fullName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.vtuEmail}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00f5a0' }}>
                      {p.vtuNumber}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={p.status} size="sm" />
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: p.warningsCount >= 2 ? '#ef4444' : p.warningsCount === 1 ? '#f59e0b' : '#10b981',
                      }}
                    >
                      {p.warningsCount}/3
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {p.isDisqualified ? (
                        <button
                          onClick={() => handleOpenAction(p, 're-enable', 1)}
                          className="btn btn-warning btn-sm"
                        >
                          <KeyRound size={13} />
                          Re-enable R1
                        </button>
                      ) : p.round1Status === 'Completed' ? (
                        <button
                          onClick={() => handleOpenAction(p, 'unlock-submission', 1)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Unlock size={13} />
                          Unlock R1
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenAction(p, 're-enable', 1)}
                          className="btn btn-outline btn-sm"
                        >
                          Permit R1
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {p.status !== 'Qualified' && p.status !== 'Round 2 Completed' ? (
                        <button
                          onClick={() => handleOpenAction(p, 'qualify', 2)}
                          className="btn btn-primary btn-sm"
                        >
                          <UserCheck size={13} />
                          Permit / Qualify R2
                        </button>
                      ) : p.round2Status === 'Completed' ? (
                        <button
                          onClick={() => handleOpenAction(p, 'unlock-submission', 2)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Unlock size={13} />
                          Unlock R2
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenAction(p, 're-enable', 2)}
                          className="btn btn-outline btn-sm"
                        >
                          Permit R2
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Permission Dialog */}
      <PermissionModal
        isOpen={isModalOpen}
        participant={selectedParticipant}
        roundNumber={targetRound}
        actionType={modalAction}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};
