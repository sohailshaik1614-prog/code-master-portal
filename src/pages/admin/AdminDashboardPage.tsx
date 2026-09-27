import React from 'react';
import { useEvent } from '../../context/EventContext';
import { StatsCard } from '../../components/admin/StatsCard';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users,
  Activity,
  HelpCircle,
  Code2,
  CheckCircle2,
  Ban,
  FileCheck,
  CalendarClock,
  PlusCircle,
  Database,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    participants,
    submissions,
    mcqQuestions,
    debuggingQuestions,
    eventSchedule,
  } = useEvent();

  const hasParticipants = participants.length > 0;
  const activeCount = participants.filter((p) => p.round1Status === 'In Progress' || p.round2Status === 'In Progress').length;
  const round1Count = participants.filter((p) => p.currentRound === 1).length;
  const round2Count = participants.filter((p) => p.currentRound === 2).length;
  const completedCount = participants.filter((p) => p.round2Status === 'Completed').length;
  const disqualifiedCount = participants.filter((p) => p.isDisqualified).length;

  return (
    <div style={{ padding: '32px' }}>
      {/* Top Banner */}
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
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 20, 36, 0.98) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#93c5fd',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            COMMAND CENTER
          </span>
          <h2 style={{ fontSize: '1.75rem', margin: '4px 0 6px' }}>Event Administration & Proctoring</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage rounds, questions, live monitoring, proctoring warnings, and participant overrides.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('/admin/round-1')} className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Add MCQ Question
          </button>
          <button onClick={() => onNavigate('/admin/round-2')} className="btn btn-royal btn-sm">
            <PlusCircle size={16} /> Add Debugging Problem
          </button>
          <button onClick={() => onNavigate('/admin/schedule')} className="btn btn-secondary btn-sm">
            <CalendarClock size={16} /> Configure Timers
          </button>
        </div>
      </div>

      {/* Real-Time Stats Cards Grid (Honoring No Fake Data Rule) */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Live Contest Telemetry</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatsCard
          label="Registered Participants"
          count={hasParticipants ? participants.length : null}
          icon={Users}
          color="#3b82f6"
          hasData={hasParticipants}
        />
        <StatsCard
          label="Active Participants"
          count={hasParticipants ? activeCount : null}
          icon={Activity}
          color="#00f5a0"
          hasData={hasParticipants}
        />
        <StatsCard
          label="Round 1 (MCQ)"
          count={hasParticipants ? round1Count : null}
          icon={HelpCircle}
          color="#00d9f5"
          hasData={hasParticipants}
        />
        <StatsCard
          label="Round 2 (Debugging)"
          count={hasParticipants ? round2Count : null}
          icon={Code2}
          color="#8b5cf6"
          hasData={hasParticipants}
        />
        <StatsCard
          label="Completed"
          count={hasParticipants ? completedCount : null}
          icon={CheckCircle2}
          color="#10b981"
          hasData={hasParticipants}
        />
        <StatsCard
          label="Disqualified"
          count={hasParticipants ? disqualifiedCount : null}
          icon={Ban}
          color="#ef4444"
          hasData={hasParticipants}
        />
        <StatsCard
          label="Total Submissions"
          count={submissions.length > 0 ? submissions.length : null}
          icon={FileCheck}
          color="#f59e0b"
          hasData={submissions.length > 0}
        />
      </div>

      {/* Overview Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Questions Status Box */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Active Question Bank</h4>
            <Database size={18} color="#00f5a0" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(7, 11, 20, 0.7)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <strong style={{ color: '#fff' }}>Round 1 — MCQ Questions</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Multiple choice bank</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: '#00d9f5' }}>
                {mcqQuestions.length} Questions
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(7, 11, 20, 0.7)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <strong style={{ color: '#fff' }}>Round 2 — Debugging Problems</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Python challenge suite</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: '#00f5a0' }}>
                {debuggingQuestions.length} Problems
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onNavigate('/admin/round-1')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Manage Round 1
            </button>
            <button onClick={() => onNavigate('/admin/round-2')} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              Manage Round 2
            </button>
          </div>
        </div>

        {/* Schedule & Timing Quick View */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Schedule & Round Status</h4>
            <CalendarClock size={18} color="#3b82f6" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(7, 11, 20, 0.7)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <strong style={{ color: '#fff' }}>Round 1 (MCQ)</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Duration: {eventSchedule.round1DurationMinutes} minutes
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#00f5a0',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 245, 160, 0.1)',
                }}
              >
                {eventSchedule.round1Status}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(7, 11, 20, 0.7)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <strong style={{ color: '#fff' }}>Round 2 (Debugging)</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Duration: {eventSchedule.round2DurationMinutes} minutes
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#00d9f5',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(0, 217, 245, 0.1)',
                }}
              >
                {eventSchedule.round2Status}
              </span>
            </div>
          </div>

          <button onClick={() => onNavigate('/admin/schedule')} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Edit Timing & Access Controls
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
