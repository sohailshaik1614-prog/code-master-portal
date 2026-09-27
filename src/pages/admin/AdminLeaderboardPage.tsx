import React from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { Trophy, Medal, Award, Clock, ArrowUpDown } from 'lucide-react';

export const AdminLeaderboardPage: React.FC = () => {
  const { getLeaderboard } = useEvent();
  const leaderboard = getLeaderboard();

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Official Championship Leaderboard</h2>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
            }}
          >
            TIE-BREAKER ACTIVE
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
          Rankings are calculated strictly by Total Score (descending), with ties decisively broken by earlier final submission timestamp.
        </p>
      </div>

      {/* Tie-breaker explanation notice card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
        }}
      >
        <ArrowUpDown size={16} color="#00f5a0" style={{ flexShrink: 0 }} />
        <span>
          <strong>Rule Enforced:</strong> If two participants score identically, the participant with the earlier submission timestamp is awarded the superior rank.
        </span>
      </div>

      {leaderboard.length === 0 ? (
        <EmptyState
          title="No competition scores evaluated yet"
          description="Leaderboard rankings will update as registered participants complete Round 1 (MCQ Challenge) and Round 2 (Python Debugging)."
          icon={<Trophy size={36} color="#f59e0b" />}
        />
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>Participant</th>
                <th>VTU Number</th>
                <th>Round 1 Score</th>
                <th>Round 2 Score</th>
                <th>Total Score</th>
                <th>Final Submission Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                let rankIcon = null;
                if (entry.rank === 1) rankIcon = <Medal size={18} color="#fbbf24" />;
                else if (entry.rank === 2) rankIcon = <Medal size={18} color="#94a3b8" />;
                else if (entry.rank === 3) rankIcon = <Medal size={18} color="#d97706" />;

                return (
                  <tr
                    key={entry.participantId}
                    style={{
                      background: entry.rank === 1 ? 'rgba(251, 191, 36, 0.04)' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {rankIcon}
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1.1rem',
                            fontWeight: 800,
                            color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#d97706' : '#fff',
                          }}
                        >
                          #{entry.rank}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{entry.fullName}</div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00f5a0' }}>
                        {entry.vtuNumber}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#00d9f5' }}>
                        {entry.round1Score}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#00f5a0' }}>
                        {entry.round2Score}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                        {entry.totalScore}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} color="#94a3b8" />
                        <span style={{ fontFamily: 'var(--font-mono)' }}>
                          {entry.submissionTimestamp ? new Date(entry.submissionTimestamp).toLocaleTimeString() : '—'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={entry.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
