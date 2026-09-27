import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { LogIn, UserPlus, Shield, User, LogOut, Menu, X, Trophy, BookOpen, Info, Home } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { currentParticipant, currentAdmin, logoutParticipant, logoutAdmin } = useEvent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        height: 'var(--nav-height)',
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand / Logos */}
        <div
          onClick={() => handleNav('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          {/* Dual Logos Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.98)',
              padding: '4px 10px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <img
              src="/assets/veltech_logo.jpg"
              alt="Vel Tech University"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ width: '1px', height: '22px', background: '#cbd5e1' }} />
            <img
              src="/assets/coding_club_logo.jpg"
              alt="Coding Club"
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          {/* Text branding */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              CODEMASTERS
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Vel Tech Coding Club • CSE(AIML)
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav-links"
        >
          <button
            onClick={() => handleNav('/')}
            className={`btn btn-sm ${currentPath === '/' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <Home size={15} />
            Home
          </button>

          <button
            onClick={() => handleNav('/event')}
            className={`btn btn-sm ${currentPath === '/event' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <Info size={15} />
            Event Details
          </button>

          <button
            onClick={() => handleNav('/rules')}
            className={`btn btn-sm ${currentPath === '/rules' ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <BookOpen size={15} />
            Rules
          </button>

          <button
            onClick={() => handleNav('/admin/leaderboard')}
            className={`btn btn-sm ${currentPath.includes('leaderboard') ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <Trophy size={15} />
            Leaderboard
          </button>
        </div>

        {/* User Auth Controls */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '12px',
          }}
          className="desktop-auth-controls"
        >
          {currentParticipant ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => handleNav('/participant/profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#070b14',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currentParticipant.vtuNumber}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#00f5a0' }}>
                    {currentParticipant.round1Status === 'Completed' ? 'R1 Done' : 'In Contest'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleNav('/participant/dashboard')}
                className="btn btn-primary btn-sm"
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  logoutParticipant();
                  handleNav('/');
                }}
                className="btn btn-outline btn-sm"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : currentAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleNav('/admin/dashboard')}
                className="btn btn-royal btn-sm"
              >
                <Shield size={16} />
                Admin Dashboard
              </button>
              <button
                onClick={() => {
                  logoutAdmin();
                  handleNav('/');
                }}
                className="btn btn-outline btn-sm"
                title="Logout Admin"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleNav('/participant/register')}
                className="btn btn-outline btn-sm"
              >
                <UserPlus size={15} />
                Register
              </button>

              <button
                onClick={() => handleNav('/participant/login')}
                className="btn btn-primary btn-sm"
              >
                <LogIn size={15} />
                Participant Login
              </button>

              <button
                onClick={() => handleNav('/admin/login')}
                className="btn btn-secondary btn-sm"
                title="Admin Portal"
              >
                <Shield size={15} />
                Admin
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-outline btn-sm mobile-menu-toggle"
          style={{ padding: '8px' }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            background: '#0d1424',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <button onClick={() => handleNav('/')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Home size={18} /> Home
          </button>
          <button onClick={() => handleNav('/event')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Info size={18} /> Event Details
          </button>
          <button onClick={() => handleNav('/rules')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <BookOpen size={18} /> Rules & Guidelines
          </button>
          <button onClick={() => handleNav('/admin/leaderboard')} className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Trophy size={18} /> Leaderboard
          </button>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />

          {currentParticipant ? (
            <>
              <button onClick={() => handleNav('/participant/dashboard')} className="btn btn-primary">
                Participant Dashboard
              </button>
              <button onClick={() => handleNav('/participant/profile')} className="btn btn-secondary">
                <User size={18} /> Profile ({currentParticipant.vtuNumber})
              </button>
              <button
                onClick={() => {
                  logoutParticipant();
                  handleNav('/');
                }}
                className="btn btn-danger btn-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : currentAdmin ? (
            <>
              <button onClick={() => handleNav('/admin/dashboard')} className="btn btn-royal">
                <Shield size={18} /> Admin Portal
              </button>
              <button
                onClick={() => {
                  logoutAdmin();
                  handleNav('/');
                }}
                className="btn btn-danger btn-sm"
              >
                <LogOut size={16} /> Logout Admin
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('/participant/login')} className="btn btn-primary">
                <LogIn size={18} /> Participant Login
              </button>
              <button onClick={() => handleNav('/participant/register')} className="btn btn-secondary">
                <UserPlus size={18} /> Register
              </button>
              <button onClick={() => handleNav('/admin/login')} className="btn btn-secondary">
                <Shield size={18} /> Admin Login
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-links { display: flex !important; }
          .desktop-auth-controls { display: flex !important; }
          .mobile-menu-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
};
