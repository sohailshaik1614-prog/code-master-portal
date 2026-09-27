import React, { useState, useEffect } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { EventInfoPage } from './pages/public/EventInfoPage';
import { RulesPage } from './pages/public/RulesPage';

// Participant Pages
import { ParticipantRegisterPage } from './pages/participant/ParticipantRegisterPage';
import { ParticipantLoginPage } from './pages/participant/ParticipantLoginPage';
import { ParticipantDashboardPage } from './pages/participant/ParticipantDashboardPage';
import { Round1MCQPage } from './pages/participant/Round1MCQPage';
import { Round2DebuggingPage } from './pages/participant/Round2DebuggingPage';
import { ParticipantProfilePage } from './pages/participant/ParticipantProfilePage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminParticipantsPage } from './pages/admin/AdminParticipantsPage';
import { AdminRound1Page } from './pages/admin/AdminRound1Page';
import { AdminRound2Page } from './pages/admin/AdminRound2Page';
import { AdminLiveMonitoringPage } from './pages/admin/AdminLiveMonitoringPage';
import { AdminLeaderboardPage } from './pages/admin/AdminLeaderboardPage';
import { AdminWarningsPage } from './pages/admin/AdminWarningsPage';
import { AdminPermissionsPage } from './pages/admin/AdminPermissionsPage';
import { AdminSchedulePage } from './pages/admin/AdminSchedulePage';

const AppContent: React.FC = () => {
  const { currentAdmin } = useEvent();

  // Simple client-side routing sync
  const getInitialPath = (): string => {
    if (window.location.hash) {
      return window.location.hash.replace('#', '') || '/';
    }
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isExamPage = currentPath === '/participant/round/1' || currentPath === '/participant/round/2';
  const isAdminPage = currentPath.startsWith('/admin') && currentPath !== '/admin/login';

  // Admin security guard: redirect to /admin/login if not authenticated
  if (isAdminPage && !currentAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main style={{ flex: 1 }}>
          <AdminLoginPage onNavigate={navigate} />
        </main>
        <Footer onNavigate={navigate} />
      </div>
    );
  }

  // 1. Examination Mode: Distraction-free full-screen layout
  if (isExamPage) {
    return (
      <div style={{ minHeight: '100vh', background: '#050810' }}>
        {currentPath === '/participant/round/1' && <Round1MCQPage onNavigate={navigate} />}
        {currentPath === '/participant/round/2' && <Round2DebuggingPage onNavigate={navigate} />}
      </div>
    );
  }

  // 2. Admin Portal Mode: Sidebar + Header Layout
  if (isAdminPage) {
    const getAdminTitle = () => {
      switch (currentPath) {
        case '/admin/dashboard': return 'Dashboard Overview';
        case '/admin/participants': return 'Participant Management';
        case '/admin/round-1': return 'Round 1 — MCQ Management';
        case '/admin/round-2': return 'Round 2 — Debugging Management';
        case '/admin/monitoring': return 'Live Monitoring Stream';
        case '/admin/leaderboard': return 'Official Leaderboard';
        case '/admin/warnings': return 'Proctoring & Warning Logs';
        case '/admin/permissions': return 'Access Control & Overrides';
        case '/admin/schedule': return 'Event Schedule & Timers';
        default: return 'Administration Portal';
      }
    };

    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <AdminSidebar currentPath={currentPath} onNavigate={navigate} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <AdminHeader title={getAdminTitle()} subtitle="CODEMASTERS • Vel Tech University Coding Club - CSE(AIML)" />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {currentPath === '/admin/dashboard' && <AdminDashboardPage onNavigate={navigate} />}
            {currentPath === '/admin/participants' && <AdminParticipantsPage onNavigate={navigate} />}
            {currentPath === '/admin/round-1' && <AdminRound1Page />}
            {currentPath === '/admin/round-2' && <AdminRound2Page />}
            {currentPath === '/admin/monitoring' && <AdminLiveMonitoringPage />}
            {currentPath === '/admin/leaderboard' && <AdminLeaderboardPage />}
            {currentPath === '/admin/warnings' && <AdminWarningsPage />}
            {currentPath === '/admin/permissions' && <AdminPermissionsPage />}
            {currentPath === '/admin/schedule' && <AdminSchedulePage />}
          </main>
        </div>
      </div>
    );
  }

  // 3. Public & Participant Portal Mode
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPath={currentPath} onNavigate={navigate} />
      <main style={{ flex: 1 }}>
        {currentPath === '/' && <HomePage onNavigate={navigate} />}
        {currentPath === '/event' && <EventInfoPage onNavigate={navigate} />}
        {currentPath === '/rules' && <RulesPage onNavigate={navigate} />}
        {currentPath === '/participant/register' && <ParticipantRegisterPage onNavigate={navigate} />}
        {currentPath === '/participant/login' && <ParticipantLoginPage onNavigate={navigate} />}
        {currentPath === '/participant/dashboard' && <ParticipantDashboardPage onNavigate={navigate} />}
        {currentPath === '/participant/profile' && <ParticipantProfilePage onNavigate={navigate} />}
        {currentPath === '/admin/login' && <AdminLoginPage onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
};

export function App() {
  return (
    <EventProvider>
      <AppContent />
    </EventProvider>
  );
}

export default App;
