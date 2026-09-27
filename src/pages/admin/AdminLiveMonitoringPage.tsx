import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { monitoringService } from '../../services/monitoringService';
import { EmptyState } from '../../components/common/EmptyState';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Activity, Radio, RefreshCw, Search } from 'lucide-react';

export const AdminLiveMonitoringPage: React.FC = () => {
  const { participants } = useEvent();
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const monitoringRows = participants.map((p) => monitoringService.toMonitoringRow(p));

  const filtered = monitoringRows.filter((r) => {
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.vtuNumber.toLowerCase().includes(q);
  });

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Live Telemetry & Proctoring</h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 245, 160, 0.1)',
                border: '1px solid rgba(0, 245, 160, 0.3)',
                color: '#00f5a0',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
            >
              <Radio size={12} className="animate-pulse" />
              WEBSOCKET READY
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Real-time candidate telemetry designed for 100+ concurrent competitors without polling overhead.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', padding: '8px 12px 8px 38px' }}
              placeholder="Filter by name or VTU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button onClick={handleManualRefresh} className="btn btn-secondary btn-sm" disabled={isRefreshing}>
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Sync Stream
          </button>
        </div>
      </div>

      {participants.length === 0 ? (
        <EmptyState
          title="No live participant streams connected"
          description="Candidates entering Round 1 or Round 2 will broadcast their real-time telemetry here. To test, register a participant account from the public portal."
          icon={<Activity size={36} color="var(--text-muted)" />}
        />
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No candidate telemetry matches "{search}".
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>VTU Number</th>
                <th>Current Round</th>
                <th>Activity State</th>
                <th>Attempted</th>
                <th>Warnings</th>
                <th>Status</th>
                <th>Score</th>
                <th>Qualification</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                let activityDot = '#10b981';
                if (r.activityStatus === 'Disqualified') activityDot = '#ef4444';
                else if (r.activityStatus === 'Idle') activityDot = '#f59e0b';
                else if (r.activityStatus === 'Not Started') activityDot = '#64748b';

                return (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ color: '#fff' }}>{r.name}</strong>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00f5a0' }}>
                        {r.vtuNumber}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#00d9f5', fontWeight: 600 }}>{r.currentRound}</span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: activityDot }} />
                        <span>{r.activityStatus}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{r.questionsAttempted}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: r.warnings >= 2 ? '#ef4444' : r.warnings === 1 ? '#f59e0b' : '#10b981',
                        }}
                      >
                        {r.warnings}/3
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={r.submissionStatus} size="sm" />
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#fff' }}>
                        {r.score}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {r.qualificationStatus}
                      </span>
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
