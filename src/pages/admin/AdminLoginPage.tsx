import React, { useState } from 'react';
import { LogoHeader } from '../../components/common/LogoHeader';
import { useEvent } from '../../context/EventContext';
import { Shield, Lock, AlertCircle, Key, ArrowRight } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { loginAdmin } = useEvent();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide administrator username and secret key.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        onNavigate('/admin/dashboard');
      } else {
        setError(res.error || 'Authentication rejected by security guard.');
      }
    } catch {
      setError('Administrative service connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <LogoHeader size="sm" showSubtitle={false} align="center" />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            marginTop: '16px',
            marginBottom: '8px',
            fontSize: '0.78rem',
            color: '#93c5fd',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
          }}
        >
          <Shield size={14} />
          <span>PROCTOR & ORGANIZER ACCESS</span>
        </div>
        <h2 style={{ fontSize: '1.9rem', marginBottom: '6px' }}>Admin Control Center</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Authorized personnel only. Sessions are encrypted and auditable.
        </p>
      </div>

      <div
        className="glass-card"
        style={{
          padding: '32px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: 'var(--shadow-lg), 0 0 30px rgba(59, 130, 246, 0.12)',
        }}
      >
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="adminUser">
              Admin Identity / Username *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="adminUser"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" htmlFor="adminPass">
              Passkey / Master Password *
            </label>
            <input
              id="adminPass"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-royal"
            style={{ width: '100%', padding: '12px' }}
          >
            {isLoading ? (
              'Authenticating...'
            ) : (
              <>
                <Key size={18} />
                Access Administration Center
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          Participant?{' '}
          <button
            onClick={() => onNavigate('/participant/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d9f5',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Go to Participant Portal
          </button>
        </div>
      </div>
    </div>
  );
};
