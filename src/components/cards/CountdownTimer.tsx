import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO string or parsable date
  label?: string;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label = 'EVENT COMMENCES IN',
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (isNaN(target) || difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        background: 'rgba(15, 23, 42, 0.7)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(0, 245, 160, 0.25)',
        boxShadow: 'var(--shadow-md), 0 0 20px rgba(0, 245, 160, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {label && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            letterSpacing: '0.15em',
            color: 'var(--accent-cyan)',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          {label}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {units.map((unit, idx) => (
          <React.Fragment key={unit.label}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(7, 11, 20, 0.9)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                minWidth: '80px',
                boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1,
                  textShadow: '0 0 10px rgba(0, 217, 245, 0.4)',
                }}
              >
                {unit.value.toString().padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  marginTop: '6px',
                  fontWeight: 600,
                }}
              >
                {unit.label}
              </span>
            </div>
            {idx < units.length - 1 && (
              <span
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: 'var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  display: 'none',
                }}
                className="countdown-colon"
              >
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      <style>{`
        @media (min-width: 600px) {
          .countdown-colon { display: block !important; }
        }
      `}</style>
    </div>
  );
};
