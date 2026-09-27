import React from 'react';

interface LogoHeaderProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  align?: 'center' | 'left';
  className?: string;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({
  size = 'md',
  showSubtitle = true,
  align = 'center',
  className = '',
}) => {
  const isLarge = size === 'lg';
  const isSmall = size === 'sm';

  const logoHeight = isLarge ? '75px' : isSmall ? '38px' : '52px';

  return (
    <div
      className={`logo-header-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align === 'center' ? 'center' : 'left',
      }}
    >
      {/* Logos Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          gap: isLarge ? '28px' : '16px',
          flexWrap: 'wrap',
          marginBottom: '14px',
        }}
      >
        {/* Vel Tech University Logo */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            padding: isLarge ? '8px 16px' : '6px 12px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            height: logoHeight,
          }}
        >
          <img
            src="/assets/veltech_logo.jpg"
            alt="Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology"
            style={{
              height: '100%',
              width: 'auto',
              maxHeight: isLarge ? '60px' : isSmall ? '28px' : '40px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Divider dot */}
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#00f5a0',
            boxShadow: '0 0 8px #00f5a0',
          }}
        />

        {/* Coding Club Logo */}
        <div
          style={{
            background: '#ffffff',
            padding: isLarge ? '8px 16px' : '6px 12px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            height: logoHeight,
          }}
        >
          <img
            src="/assets/coding_club_logo.jpg"
            alt="Code Masters CSE-AIML Coding Club"
            style={{
              height: '100%',
              width: 'auto',
              maxHeight: isLarge ? '60px' : isSmall ? '28px' : '40px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Official Branding Text Underneath */}
      {showSubtitle && (
        <div style={{ marginTop: '4px' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: isLarge ? '1.15rem' : isSmall ? '0.85rem' : '1rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            Coding Club
          </div>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: isLarge ? '2.4rem' : isSmall ? '1.4rem' : '1.8rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              background: 'linear-gradient(135deg, #00f5a0 0%, #00d9f5 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              lineHeight: 1.15,
            }}
          >
            CODEMASTERS
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: isLarge ? '0.95rem' : isSmall ? '0.75rem' : '0.85rem',
              fontWeight: 600,
              color: '#00d9f5',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            CSE(AIML)
          </div>
        </div>
      )}
    </div>
  );
};
