import React from 'react';
import { useEvent } from '../../context/EventContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { User, Mail, Hash, Award, ShieldAlert, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ParticipantProfilePageProps {
  onNavigate: (path: string) => void;
}

export const ParticipantProfilePage: React.FC<ParticipantProfilePageProps> = ({ onNavigate }) => {
  const { currentParticipant, submissions } = useEvent();

  if (!currentParticipant) {
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2>Session Not Found</h2>
        <button onClick={() => onNavigate('/participant/login')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Login
        </button>
      </div>
    );
  }

  const participantSubmissions = submissions.filter((s) => s.participantId === currentParticipant.id);

  return (
    <div style={{ maxWidth: '840px', margin: '40px auto 80px', padding: '0 24px' }}>
      <button
        onClick={() => onNavigate('/participant/dashboard')}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '24px' }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Main Profile Card */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070b14',
            }}
          >
            <User size={32} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{currentParticipant.fullName}</h2>
              <StatusBadge status={currentParticipant.status} />
            </div>
            <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
              Registered Participant • CODEMASTERS
            </p>
          </div>
        </div>

        {/* Credentials Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            background: 'rgba(7, 11, 20, 0.7)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <Hash size={14} /> VTU Number
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: '#00f5a0', marginTop: '4px' }}>
              {currentParticipant.vtuNumber}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <Mail size={14} /> University Email
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#e2e8f0', marginTop: '4px' }}>
              {currentParticipant.vtuEmail}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <Award size={14} /> Total Score
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
              {currentParticipant.totalScore} Marks
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <ShieldAlert size={14} /> Active Warnings
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: currentParticipant.warningsCount >= 2 ? '#ef4444' : currentParticipant.warningsCount === 1 ? '#f59e0b' : '#10b981',
                marginTop: '4px',
              }}
            >
              {currentParticipant.warningsCount}/3
            </div>
          </div>
        </div>
      </div>

      {/* Submission History Section */}
      <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Submission History</h3>
      {participantSubmissions.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No round submissions recorded yet. Once you complete Round 1 or Round 2, authoritative evaluation timestamps will appear here.
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Score</th>
                <th>Status</th>
                <th>Authoritative Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {participantSubmissions.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <strong>Round 0{sub.roundId}</strong> ({sub.roundId === 1 ? 'MCQ Challenge' : 'Python Debugging'})
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00f5a0' }}>
                      {sub.score} / {sub.maxScore}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={sub.status} size="sm" />
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(sub.submittedAt).toLocaleTimeString()} ({new Date(sub.submittedAt).toLocaleDateString()})
                    </span>
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
