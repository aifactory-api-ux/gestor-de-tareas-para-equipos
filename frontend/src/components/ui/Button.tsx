import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const heights: Record<string, string> = {
    sm: '32px',
    md: '40px',
    lg: '48px',
  };

  const paddingMap: Record<string, string> = {
    sm: tokens.spacing.sm,
    md: tokens.spacing.lg,
    lg: tokens.spacing.xl,
  };

  const variantStyles: Record<string, Record<string, string>> = {
    primary: {
      backgroundColor: tokens.colors.primary.base,
      color: tokens.colors.neutrals.white,
      border: 'none',
    },
    secondary: {
      backgroundColor: tokens.colors.neutrals.surface,
      color: tokens.colors.neutrals.text_primary,
      border: `1px solid ${tokens.colors.neutrals.border}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: tokens.colors.neutrals.text_primary,
      border: 'none',
    },
    danger: {
      backgroundColor: tokens.colors.semantic.danger,
      color: tokens.colors.neutrals.white,
      border: 'none',
    },
  };

  const hoverStyles: Record<string, Record<string, string>> = {
    primary: { backgroundColor: tokens.colors.primary.hover },
    secondary: { backgroundColor: tokens.colors.neutrals.surface_muted },
    ghost: { backgroundColor: tokens.colors.neutrals.surface_muted },
    danger: { backgroundColor: '#B91C1C' },
  };

  const style = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${tokens.spacing.sm};
    height: ${heights[size]};
    padding: 0 ${paddingMap[size]};
    font-family: ${tokens.typography.font_family};
    font-size: ${tokens.typography.sizes.body.size};
    font-weight: ${tokens.typography.weights.medium};
    border-radius: ${tokens.radii.md};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    opacity: ${disabled ? 0.5 : 1};
    transition: all ${tokens.motion_interaction.duration_fast} ${tokens.motion_interaction.easing};
    ${Object.entries(variantStyles[variant])
      .map(([k, v]) => `${k}: ${v}`)
      .join('; ')}
    ${className}
  `;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const target = e.currentTarget;
      Object.entries(hoverStyles[variant]).forEach(([k, v]) => {
        target.style[k as any] = v;
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    Object.entries(variantStyles[variant]).forEach(([k, v]) => {
      target.style[k as any] = v;
    });
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ display: 'inline-flex' }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && iconPosition === 'left' && icon}
      {label}
      {icon && iconPosition === 'right' && icon}
      <style>{style}</style>
    </button>
  );
}
