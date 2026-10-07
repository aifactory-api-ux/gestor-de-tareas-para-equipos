import { tokens } from '../../styles/tokens';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing['2xl'],
    textAlign: 'center',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.neutrals.surface_muted,
    borderRadius: tokens.radii.lg,
    marginBottom: tokens.spacing.lg,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h2.size,
    fontWeight: tokens.typography.weights.semibold,
    color: tokens.colors.neutrals.text_primary,
    marginBottom: tokens.spacing.sm,
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_secondary,
    marginBottom: tokens.spacing.lg,
    maxWidth: '320px',
  };

  return (
    <div style={containerStyle}>
      <div style={iconContainerStyle}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke={tokens.colors.neutrals.text_tertiary}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <path d="M9 12h6" />
          <path d="M9 16h6" />
        </svg>
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
      {actionLabel && onAction && (
        <Button label={actionLabel} onClick={onAction} variant="primary" size="md" />
      )}
    </div>
  );
}