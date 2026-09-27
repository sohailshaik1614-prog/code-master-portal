import React from 'react';
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Code2,
  Activity,
  Trophy,
  AlertTriangle,
  KeyRound,
  CalendarClock,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useEvent } from '../../context/EventContext';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPath, onNavigate }) => {
  const { logoutAdmin } = useEvent();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/participants', label: 'Participants', icon: Users },
    { path: '/admin/round-1', label: 'Round 1 — MCQ', icon: HelpCircle },
    { path: '/admin/round-2', label: 'Round 2 — Debugging', icon: Code2 },
    { path: '/admin/monitoring', label: 'Live Monitoring', icon: Activity },
    { path: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/admin/warnings', label: 'Warnings', icon: AlertTriangle },
    { path: '/admin/permissions', label: 'Permissions & Access', icon: KeyRound },
    { path: '/admin/schedule', label: 'Schedule & Timers', icon: CalendarClock },
  ];

  return (
    <aside
      style={{
        width: '260px',
        minHeight: '100vh',
        background: '#070b14',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        padding: '24px 16px',
      }}
    >
      {/* Admin Logo Header */}
      <div style={{ marginBottom: '28px', padding: '0 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              background: '#ffffff',
              padding: '2px 6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <img src="/assets/veltech_logo.jpg" alt="Vel Tech" style={{ height: '20px' }} />
            <img src="/assets/coding_club_logo.jpg" alt="Coding Club" style={{ height: '20px' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#00f5a0',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            ADMIN PORTAL
          </span>
        </div>
        <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
          CODEMASTERS
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Vel Tech Coding Club • CSE(AIML)
        </p>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className="btn"
              style={{
                justifyContent: 'flex-start',
                padding: '10px 14px',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'rgba(0, 245, 160, 0.12)' : 'transparent',
                borderColor: isActive ? 'rgba(0, 245, 160, 0.3)' : 'transparent',
                color: isActive ? '#00f5a0' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 0 15px rgba(0, 245, 160, 0.1)' : 'none',
              }}
            >
              <Icon size={18} color={isActive ? '#00f5a0' : 'currentColor'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          onClick={() => onNavigate('/')}
          className="btn btn-outline btn-sm"
          style={{ justifyContent: 'flex-start', color: 'var(--text-muted)' }}
        >
          <ExternalLink size={16} />
          View Public Site
        </button>

        <button
          onClick={() => {
            logoutAdmin();
            onNavigate('/');
          }}
          className="btn btn-danger btn-sm"
          style={{ justifyContent: 'flex-start' }}
        >
          <LogOut size={16} />
          Sign Out Admin
        </button>
      </div>
    </aside>
  );
};
