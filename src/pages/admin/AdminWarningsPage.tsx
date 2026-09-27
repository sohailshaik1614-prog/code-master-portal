import React from 'react';
import { useEvent } from '../../context/EventContext';
import { EmptyState } from '../../components/common/EmptyState';
import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

export const AdminWarningsPage: React.FC = () => {
  const { warnings, resetParticipantWarnings } = useEvent();

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Proctoring Infractions & Warnings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Audit proctoring events triggered by browser tab-switching, window blur, context menu, or clipboard interactions.
        </p>
      </div>

      {warnings.length === 0 ? (
        <EmptyState
          title="No infractions recorded"
          description="Contest integrity is clear. When anti-cheat hooks detect unpermitted participant actions in Round 1 or Round 2, incident logs will be displayed here."
          icon={<ShieldCheck size={36} color="#00f5a0" />}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Participant</th>
                <th>VTU Number</th>
                <th>Round</th>
                <th>Warning Level</th>
                <th>Infraction Reason</th>
                <th>Logged Message</th>
                <th>Timestamp</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((w) => (
                <tr key={w.id}>
                  <td>
                    <strong style={{ color: '#fff' }}>{w.participantName}</strong>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00f5a0' }}>
                      {w.vtuNumber}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#00d9f5' }}>Round 0{w.roundNumber}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        background: w.warningNumber === 3 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        border: w.warningNumber === 3 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                        color: w.warningNumber === 3 ? '#ef4444' : '#f59e0b',
                      }}
                    >
                      {w.warningNumber}/3 {w.warningNumber === 3 ? '(Disqualified)' : ''}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#fff', fontWeight: 500 }}>{w.reason}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{w.message}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {new Date(w.timestamp).toLocaleTimeString()}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => resetParticipantWarnings(w.participantId)}
                      className="btn btn-outline btn-sm"
                      title="Clear candidate warnings"
                    >
                      <RotateCcw size={13} />
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
