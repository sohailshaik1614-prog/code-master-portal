import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { PermissionModal } from '../../components/admin/PermissionModal';
import { Participant } from '../../types';
import { Search, UserCheck, ShieldAlert, KeyRound, RotateCcw, Unlock, UserX } from 'lucide-react';

interface AdminParticipantsPageProps {
  onNavigate: (path: string) => void;
}

export const AdminParticipantsPage: React.FC<AdminParticipantsPageProps> = () => {
  const {
    participants,
    reEnableParticipant,
    resetParticipantWarnings,
    unlockSubmission,
    qualifyParticipant,
  } = useEvent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [modalAction, setModalAction] = useState<'re-enable' | 'unlock-submission' | 'reset-warnings' | 'qualify'>('re-enable');
  const [targetRound, setTargetRound] = useState<1 | 2>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.vtuNumber.toLowerCase().includes(q) ||
      p.vtuEmail.toLowerCase().includes(q)
    );
  });

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

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Participant Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Inspect participant records, override disqualifications, reset warnings, and grant stage qualifications.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by name, VTU number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState
          title="No participant data connected"
          description="There are currently no registered participants in the local session. When participants register via the registration form, or once backend database sync is established, their records will display here."
          icon={<UserX size={36} color="var(--text-muted)" />}
        />
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No participants match the search query "{searchQuery}".
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>VTU Number</th>
                <th>Status</th>
                <th>R1 Score</th>
                <th>R2 Score</th>
                <th>Total</th>
                <th>Warnings</th>
                <th>Overrides & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
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
                    <span style={{ fontFamily: 'var(--font-mono)', color: p.round1Score !== null ? '#00d9f5' : 'var(--text-muted)' }}>
                      {p.round1Score !== null ? p.round1Score : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', color: p.round2Score !== null ? '#00f5a0' : 'var(--text-muted)' }}>
                      {p.round2Score !== null ? p.round2Score : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
                      {p.totalScore}
                    </span>
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
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {p.isDisqualified ? (
                        <button
                          onClick={() => handleOpenAction(p, 're-enable', p.currentRound || 1)}
                          className="btn btn-warning btn-sm"
                          title="Re-enable participant from disqualification"
                        >
                          <KeyRound size={13} />
                          Re-enable
                        </button>
                      ) : (
                        <>
                          {p.warningsCount > 0 && (
                            <button
                              onClick={() => handleOpenAction(p, 'reset-warnings', 1)}
                              className="btn btn-outline btn-sm"
                              title="Reset warning count to 0"
                            >
                              <RotateCcw size={13} />
                              Reset Warnings
                            </button>
                          )}

                          {p.status !== 'Qualified' && p.status !== 'Round 2 Completed' && (
                            <button
                              onClick={() => handleOpenAction(p, 'qualify', 2)}
                              className="btn btn-primary btn-sm"
                              title="Qualify for Round 2"
                            >
                              <UserCheck size={13} />
                              Qualify R2
                            </button>
                          )}

                          {(p.round1Status === 'Completed' || p.round2Status === 'Completed') && (
                            <button
                              onClick={() => handleOpenAction(p, 'unlock-submission', p.round2Status === 'Completed' ? 2 : 1)}
                              className="btn btn-secondary btn-sm"
                              title="Unlock submission for re-entry"
                            >
                              <Unlock size={13} />
                              Unlock
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Permission & Override Modal */}
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
