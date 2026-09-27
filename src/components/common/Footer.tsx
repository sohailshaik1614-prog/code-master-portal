import React from 'react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        background: '#04070d',
        borderTop: '1px solid var(--border-subtle)',
        padding: '48px 24px 32px',
        color: 'var(--text-secondary)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '36px',
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img src="/assets/veltech_logo.jpg" alt="Vel Tech" style={{ height: '26px' }} />
              <img src="/assets/coding_club_logo.jpg" alt="Coding Club" style={{ height: '26px' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>
              CODEMASTERS
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '14px' }}>
            Official premier competitive coding portal organized by Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Coding Club — Department of CSE(AIML).
          </p>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--accent-cyan)',
              letterSpacing: '0.05em',
            }}
          >
            Think. Code. Debug. Conquer.
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', marginBottom: '14px', fontSize: '0.98rem' }}>Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <li>
              <button
                onClick={() => onNavigate?.('/')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate?.('/event')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Event Details & Schedule
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate?.('/rules')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Rules & Anti-Cheating Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate?.('/admin/leaderboard')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Official Leaderboard
              </button>
            </li>
          </ul>
        </div>

        {/* Competition Formats */}
        <div>
          <h4 style={{ color: '#fff', marginBottom: '14px', fontSize: '0.98rem' }}>Rounds Overview</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#00d9f5' }}>Round 1:</strong> MCQ Challenge (Algorithms & Core CS Concepts)
            </div>
            <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <strong style={{ color: '#00f5a0' }}>Round 2:</strong> Python Debugging & Test-Case Execution
            </div>
          </div>
        </div>

        {/* University Info */}
        <div>
          <h4 style={{ color: '#fff', marginBottom: '14px', fontSize: '0.98rem' }}>Institution</h4>
          <p style={{ fontSize: '0.88rem', lineHeight: '1.6' }}>
            <strong>Vel Tech University</strong><br />
            Avadi, Chennai, Tamil Nadu, India.<br />
            Department of Computer Science and Engineering (AIML)<br />
            <span style={{ color: '#94a3b8' }}>Support: codingclub@veltech.edu.in</span>
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          © {new Date().getFullYear()} Vel Tech University Coding Club - CSE(AIML). All rights reserved.
        </div>
        <div>
          Frontend Assessment Platform • CODEMASTERS Edition
        </div>
      </div>
    </footer>
  );
};
