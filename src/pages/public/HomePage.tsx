import React from 'react';
import { LogoHeader } from '../../components/common/LogoHeader';
import { CountdownTimer } from '../../components/cards/CountdownTimer';
import { useEvent } from '../../context/EventContext';
import {
  LogIn,
  Shield,
  BookOpen,
  ArrowRight,
  Code2,
  HelpCircle,
  Award,
  Zap,
  CheckCircle,
  Cpu,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { eventSchedule, currentParticipant, currentAdmin } = useEvent();

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '60px 24px 80px',
          textAlign: 'center',
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
        }}
      >
        {/* Prominent Logo & Branding Display as required */}
        <LogoHeader size="lg" showSubtitle={true} align="center" />

        {/* Main Title & Tagline */}
        <div style={{ marginTop: '28px', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              background: 'linear-gradient(180deg, #ffffff 0%, #94a3b8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
            }}
          >
            CODEMASTERS
          </h1>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              fontWeight: 800,
              color: '#00f5a0',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: '0 0 25px rgba(0, 245, 160, 0.4)',
            }}
          >
            Think. Code. Debug. Conquer.
          </div>
        </div>

        {/* Event Description */}
        <p
          style={{
            maxWidth: '720px',
            margin: '0 auto 36px',
            fontSize: '1.1rem',
            lineHeight: '1.7',
            color: 'var(--text-secondary)',
          }}
        >
          Welcome to the flagship annual collegiate competitive programming championship organized by the
          <strong> Vel Tech University Coding Club</strong>, Department of <strong>CSE(AIML)</strong>. Test your algorithmic intuition in Round 1 MCQ, and debug high-performance Python code under rigorous automated test cases in Round 2.
        </p>

        {/* Primary & Secondary Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}
        >
          {currentParticipant ? (
            <button
              onClick={() => onNavigate('/participant/dashboard')}
              className="btn btn-primary btn-lg"
            >
              Go to Participant Dashboard
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/participant/login')}
              className="btn btn-primary btn-lg"
            >
              <LogIn size={20} />
              Participant Login
            </button>
          )}

          {currentAdmin ? (
            <button
              onClick={() => onNavigate('/admin/dashboard')}
              className="btn btn-royal btn-lg"
            >
              <Shield size={20} />
              Admin Portal
            </button>
          ) : (
            <button
              onClick={() => onNavigate('/admin/login')}
              className="btn btn-secondary btn-lg"
            >
              <Shield size={20} />
              Admin Login
            </button>
          )}

          <button
            onClick={() => onNavigate('/rules')}
            className="btn btn-outline btn-lg"
          >
            <BookOpen size={18} />
            Event Rules
          </button>

          <button
            onClick={() => onNavigate('/event')}
            className="btn btn-outline btn-lg"
          >
            <Zap size={18} />
            Rounds Info
          </button>
        </div>

        {/* Event Countdown Section */}
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <CountdownTimer
            targetDate={eventSchedule.round1Start || '2026-09-29T10:30:00'}
            label="CHAMPIONSHIP ROUND 1 COMMENCES IN"
          />
        </div>
      </section>

      {/* Rounds Overview Cards */}
      <section
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '0 24px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#00d9f5',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            COMPETITION STRUCTURE
          </span>
          <h2 style={{ fontSize: '2.2rem', marginTop: '6px' }}>Two Rigorous Assessment Stages</h2>
          <p style={{ maxWidth: '600px', margin: '8px auto 0', color: 'var(--text-secondary)' }}>
            Each stage evaluates distinct facets of modern computer science and artificial intelligence engineering.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}
        >
          {/* Round 1 Card */}
          <div className="glass-card glass-card-interactive" style={{ borderTop: '4px solid #00d9f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 217, 245, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00d9f5',
                }}
              >
                <HelpCircle size={24} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00d9f5', fontWeight: 700 }}>
                  STAGE 01
                </span>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>MCQ Challenge</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Comprehensive multiple-choice assessment probing core CS fundamentals, data structures, algorithms, time complexity, and AIML heuristics. Features custom negative marking rules.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00f5a0" />
                <span>Automated objective scoring & instant result calculation</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00f5a0" />
                <span>Proctored 3-warning anti-cheat violation monitor</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00f5a0" />
                <span>Qualifying benchmark required to unlock Round 2</span>
              </li>
            </ul>
          </div>

          {/* Round 2 Card */}
          <div className="glass-card glass-card-interactive" style={{ borderTop: '4px solid #00f5a0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 245, 160, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f5a0',
                }}
              >
                <Code2 size={24} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#00f5a0', fontWeight: 700 }}>
                  STAGE 02
                </span>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Python Debugging</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Inspect and repair intentionally broken Python programs. Modify buggy implementations in a full-featured Monaco Code Editor and validate against both visible and hidden test suites.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00f5a0" />
                <span>Monaco Editor with syntax highlighting & auto-indent</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00f5a0" />
                <span>Hidden test case confidentiality & partial score grading</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#00f5a0" />
                <span>Authoritative submission timestamp tie-breaker logic</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          <div className="glass-card" style={{ padding: '20px' }}>
            <Cpu size={24} color="#00f5a0" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>VTU Authentication</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              Standardized login with your official <code style={{ color: '#00d9f5' }}>vtuxxxxx@veltech.edu.in</code> student credentials.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <Award size={24} color="#f59e0b" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Dynamic Tie-Breaker</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              Equal score ties are decisively broken in favor of the participant with the earlier submission timestamp.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <Shield size={24} color="#3b82f6" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>Admin Live Telemetry</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              Proctors monitor active participants, time limits, infractions, and override accidental lockouts in real time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
