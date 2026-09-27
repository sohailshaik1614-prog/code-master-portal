import React, { useState } from 'react';
import { LogoHeader } from '../../components/common/LogoHeader';
import { validateVTUEmail, defaultConfig } from '../../services/authService';
import { useEvent } from '../../context/EventContext';
import { Modal } from '../../components/common/Modal';
import { Eye, EyeOff, AlertCircle, LogIn, HelpCircle, Shield, ArrowRight } from 'lucide-react';

interface ParticipantLoginPageProps {
  onNavigate: (path: string) => void;
}

export const ParticipantLoginPage: React.FC<ParticipantLoginPageProps> = ({ onNavigate }) => {
  const { loginParticipant } = useEvent();

  const [vtuEmail, setVtuEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ vtuEmail?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Auto-fill default password helper for convenience
  const handleEmailChange = (val: string) => {
    setVtuEmail(val);
    if (errors.vtuEmail || errors.general) {
      setErrors({ ...errors, vtuEmail: undefined, general: undefined });
    }

    // If user types a valid VTU email and password is empty, suggest/autofill default password
    const validation = validateVTUEmail(val);
    if (validation.isValid && validation.extractedVtuDigits && !password) {
      setPassword(validation.extractedVtuDigits);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { vtuEmail?: string; password?: string } = {};

    const validation = validateVTUEmail(vtuEmail);
    if (!validation.isValid) {
      newErrors.vtuEmail = validation.errorMessage;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await loginParticipant(vtuEmail, password);
      if (res.success) {
        onNavigate('/participant/dashboard');
      } else {
        setErrors({ general: res.error || 'Invalid credentials. Please verify your VTU credentials.' });
      }
    } catch {
      setErrors({ general: 'Authentication service encountered an unexpected error.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <LogoHeader size="sm" showSubtitle={false} align="center" />
        <h2 style={{ fontSize: '1.9rem', marginTop: '16px', marginBottom: '6px' }}>
          Participant Login
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Enter your university credentials to access the examination hall.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        {errors.general && (
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
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* VTU Email ID */}
          <div className="form-group">
            <label className="form-label" htmlFor="loginEmail">
              VTU Email ID *
            </label>
            <input
              id="loginEmail"
              type="email"
              className="form-input"
              placeholder={`vtu12345@${defaultConfig.vtuEmailDomain}`}
              value={vtuEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              autoComplete="username"
            />
            {errors.vtuEmail ? (
              <div className="form-error">{errors.vtuEmail}</div>
            ) : (
              <div className="form-hint">
                e.g. <code>vtu12345@{defaultConfig.vtuEmailDomain}</code>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="loginPassword">
                Password *
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#00d9f5',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="5-digit number (e.g. 12345)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                autoComplete="current-password"
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {/* Password Rule Reminder Note */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 245, 160, 0.06)',
              border: '1px solid rgba(0, 245, 160, 0.2)',
              fontSize: '0.8rem',
              color: '#a7f3d0',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Shield size={16} color="#00f5a0" style={{ flexShrink: 0 }} />
            <span>
              Default password rule: <strong>5-digit number</strong> following "vtu" in your email.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            {isLoading ? (
              'Verifying Session...'
            ) : (
              <>
                <LogIn size={18} />
                Enter Assessment Dashboard
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
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}
        >
          Not registered yet?{' '}
          <button
            onClick={() => onNavigate('/participant/register')}
            style={{
              background: 'none',
              border: 'none',
              color: '#00f5a0',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Register here
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Password Recovery & Rules"
      >
        <div style={{ padding: '6px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00d9f5', marginBottom: '14px' }}>
            <HelpCircle size={22} />
            <h4 style={{ margin: 0, color: '#fff' }}>Default Authentication Standard</h4>
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Under Vel Tech CODEMASTERS regulations, participant accounts are pre-keyed with your university ID:
          </p>

          <div
            style={{
              background: 'rgba(7, 11, 20, 0.9)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}
          >
            <div style={{ color: 'var(--text-muted)' }}>Email Example:</div>
            <div style={{ color: '#00d9f5', fontWeight: 700, marginBottom: '8px' }}>
              vtu<strong>12345</strong>@{defaultConfig.vtuEmailDomain}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>Your Default Password:</div>
            <div style={{ color: '#00f5a0', fontWeight: 800, fontSize: '1.1rem' }}>
              12345
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            If you changed your password or cannot access your account, contact the proctoring desk at <code style={{ color: '#00d9f5' }}>codingclub@veltech.edu.in</code> or visit the Admin help desk.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForgotModal(false)} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
