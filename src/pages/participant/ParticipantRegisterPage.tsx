import React, { useState } from 'react';
import { LogoHeader } from '../../components/common/LogoHeader';
import { validateVTUEmail, defaultConfig } from '../../services/authService';
import { useEvent } from '../../context/EventContext';
import { UserCheck, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface ParticipantRegisterPageProps {
  onNavigate: (path: string) => void;
}

export const ParticipantRegisterPage: React.FC<ParticipantRegisterPageProps> = ({ onNavigate }) => {
  const { registerParticipant } = useEvent();

  const [fullName, setFullName] = useState('');
  const [vtuEmail, setVtuEmail] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; vtuEmail?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; vtuEmail?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    const emailValidation = validateVTUEmail(vtuEmail);
    if (!emailValidation.isValid) {
      newErrors.vtuEmail = emailValidation.errorMessage;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await registerParticipant(fullName, vtuEmail);
      if (res.success) {
        setRegistrationSuccess(true);
      } else {
        setErrors({ general: res.error || 'Registration failed. Please check your credentials.' });
      }
    } catch {
      setErrors({ general: 'Network simulation error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <LogoHeader size="sm" showSubtitle={false} align="center" />
        <h2 style={{ fontSize: '1.9rem', marginTop: '16px', marginBottom: '6px' }}>
          Participant Registration
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Register for CODEMASTERS • Vel Tech University Coding Club
        </p>
      </div>

      {registrationSuccess ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '36px 28px',
            border: '1px solid rgba(0, 245, 160, 0.4)',
            boxShadow: 'var(--shadow-lg), 0 0 25px rgba(0, 245, 160, 0.15)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(0, 245, 160, 0.15)',
              border: '2px solid #00f5a0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#00f5a0',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h3 style={{ fontSize: '1.6rem', marginBottom: '8px', color: '#fff' }}>
            Registration Successful
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '22px', lineHeight: '1.6' }}>
            Your CODEMASTERS participant account has been created.
          </p>

          {/* Credentials Info Box */}
          <div
            style={{
              background: 'rgba(7, 11, 20, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '26px',
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                VTU Email:
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#00d9f5', fontSize: '1.05rem' }}>
                {vtuEmail}
              </div>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Your default login password is the 5-digit number associated with your VTU email.
            </div>
          </div>

          <button
            onClick={() => onNavigate('/participant/login')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Proceed to Participant Login
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
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

          <form onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                className="form-input"
                placeholder="e.g. S. Vignesh / A. Deepika"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
              />
              {errors.fullName && <div className="form-error">{errors.fullName}</div>}
            </div>

            {/* VTU Email ID */}
            <div className="form-group">
              <label className="form-label" htmlFor="vtuEmail">
                VTU Email ID *
              </label>
              <input
                id="vtuEmail"
                type="email"
                className="form-input"
                placeholder={`vtu12345@${defaultConfig.vtuEmailDomain}`}
                value={vtuEmail}
                onChange={(e) => {
                  setVtuEmail(e.target.value);
                  if (errors.vtuEmail) setErrors({ ...errors, vtuEmail: undefined });
                }}
              />
              {errors.vtuEmail ? (
                <div className="form-error">{errors.vtuEmail}</div>
              ) : (
                <div className="form-hint">
                  Format: <code>vtu[5 digits]@{defaultConfig.vtuEmailDomain}</code>
                </div>
              )}
            </div>

            {/* Info note */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                display: 'flex',
                gap: '8px',
              }}
            >
              <ShieldCheck size={18} color="#00f5a0" style={{ flexShrink: 0 }} />
              <span>
                Your default password will be automatically assigned as the 5-digit number in your VTU email address.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {isLoading ? 'Validating Registration...' : 'Complete Registration'}
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
            Already registered?{' '}
            <button
              onClick={() => onNavigate('/participant/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#00f5a0',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Log in here
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
