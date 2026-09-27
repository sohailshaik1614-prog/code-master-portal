import React from 'react';
import { useEvent } from '../../context/EventContext';
import { roundService } from '../../services/roundService';
import { RoundCard } from '../../components/cards/RoundCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Trophy,
  ShieldAlert,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  LogOut,
  Laptop,
} from 'lucide-react';

interface ParticipantDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const ParticipantDashboardPage: React.FC<ParticipantDashboardPageProps> = ({ onNavigate }) => {
  const {
    currentParticipant,
    logoutParticipant,
    eventSchedule,
    adminPermissions,
  } = useEvent();

  if (!currentParticipant) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <div className="glass-card" style={{ padding: '40px' }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h2>Session Not Found</h2>
          <p style={{ margin: '12px 0 24px', color: 'var(--text-secondary)' }}>
            Please log in with your VTU student email to view your personalized competition dashboard.
          </p>
          <button onClick={() => onNavigate('/participant/login')} className="btn btn-primary">
            Go to Participant Login
          </button>
        </div>
      </div>
    );
  }

  // Check round entry accessibility using roundService
  const round1Access = roundService.canEnterRound(currentParticipant, 1, eventSchedule, adminPermissions);
  const round2Access = roundService.canEnterRound(currentParticipant, 2, eventSchedule, adminPermissions);

  const round1Status = roundService.getRoundCardStatus(currentParticipant, 1, eventSchedule);
  const round2Status = roundService.getRoundCardStatus(currentParticipant, 2, eventSchedule);

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Mobile Screen Recommendation Alert */}
      <div className="mobile-exam-warning">
        <Laptop size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
        <strong>Notice:</strong> For the best examination experience, use a laptop or desktop computer.
      </div>

      {/* Participant Banner Card */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          padding: '24px 32px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 20, 36, 0.95) 100%)',
          border: '1px solid rgba(0, 245, 160, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Avatar Icon */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#070b14',
              boxShadow: '0 0 20px rgba(0, 245, 160, 0.3)',
            }}
          >
            <User size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{currentParticipant.fullName}</h2>
              <StatusBadge status={currentParticipant.status} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', fontSize: '0.85rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#00f5a0', fontWeight: 700 }}>
                {currentParticipant.vtuNumber}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {currentParticipant.vtuEmail}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onNavigate('/participant/profile')}
            className="btn btn-secondary btn-sm"
          >
            Full Profile
          </button>

          <button
            onClick={() => {
              logoutParticipant();
              onNavigate('/');
            }}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-danger)' }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        {/* Total Score */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Score
            </span>
            <Trophy size={18} color="#00f5a0" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
            {currentParticipant.totalScore}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            R1: {currentParticipant.round1Score ?? 0} | R2: {currentParticipant.round2Score ?? 0}
          </div>
        </div>

        {/* Current Round */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Current Stage
            </span>
            <Award size={18} color="#00d9f5" />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#00d9f5' }}>
            {currentParticipant.currentRound ? `Round 0${currentParticipant.currentRound}` : 'Finished'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {currentParticipant.round1Status === 'Completed' ? 'Python Debugging' : 'MCQ Assessment'}
          </div>
        </div>

        {/* Warning Tracker */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Warnings Active
            </span>
            <ShieldAlert size={18} color={currentParticipant.warningsCount >= 2 ? '#ef4444' : '#f59e0b'} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: currentParticipant.warningsCount >= 2 ? 'var(--color-danger)' : currentParticipant.warningsCount === 1 ? 'var(--color-warning)' : '#10b981',
            }}
          >
            {currentParticipant.warningsCount}/3
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {currentParticipant.isDisqualified ? 'Disqualified (Round Locked)' : 'Clean integrity status'}
          </div>
        </div>

        {/* Qualification Status */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Progression
            </span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            {currentParticipant.status}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Official assessment progression
          </div>
        </div>
      </div>

      {/* Round Cards Grid */}
      <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Competition Stages</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Round 1 Card */}
        <RoundCard
          roundNumber={1}
          title="Core CS & Algorithmic MCQ"
          type="MCQ Challenge"
          description="Evaluate computational complexity, algorithmic intuition, and computer science concepts under timed proctoring."
          status={round1Status}
          score={currentParticipant.round1Score}
          maxScore={100}
          durationMinutes={eventSchedule.round1DurationMinutes}
          warningsCount={currentParticipant.warningsCount}
          canEnter={round1Access.canEnter}
          lockReason={!round1Access.canEnter ? round1Access.reason : undefined}
          onEnter={() => onNavigate('/participant/round/1')}
        />

        {/* Round 2 Card */}
        <RoundCard
          roundNumber={2}
          title="Python Code Debugging"
          type="Hands-on Code Repair"
          description="Diagnose bugs in complex Python code, edit in Monaco Editor, and execute against both visible and hidden test case suites."
          status={round2Status}
          score={currentParticipant.round2Score}
          maxScore={100}
          durationMinutes={eventSchedule.round2DurationMinutes}
          warningsCount={currentParticipant.warningsCount}
          canEnter={round2Access.canEnter}
          lockReason={!round2Access.canEnter ? round2Access.reason : undefined}
          onEnter={() => onNavigate('/participant/round/2')}
        />
      </div>
    </div>
  );
};
