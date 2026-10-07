import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens';

interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'subtle' | 'card' | 'sticky';
  className?: string;
}

export default function Card({
  children,
  padding = 'md',
  elevation = 'card',
  className = '',
}: CardProps) {
  const paddingMap: Record<string, string> = {
    sm: tokens.spacing.md,
    md: tokens.spacing.lg,
    lg: tokens.spacing.xl,
  };

  const shadowMap: Record<string, string> = {
    subtle: tokens.shadows.subtle,
    card: tokens.shadows.card,
    sticky: tokens.shadows.sticky,
  };

  const style: React.CSSProperties = {
    backgroundColor: tokens.colors.neutrals.surface,
    borderRadius: tokens.radii.lg,
    padding: paddingMap[padding],
    boxShadow: shadowMap[elevation],
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}