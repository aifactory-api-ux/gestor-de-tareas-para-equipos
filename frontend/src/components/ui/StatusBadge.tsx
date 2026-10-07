import { tokens } from '../../styles/tokens';

interface StatusBadgeProps {
  status: 'pendiente' | 'en curso' | 'terminada';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const labelMap: Record<string, string> = {
    pendiente: 'Pendiente',
    'en curso': 'En curso',
    terminada: 'Terminada',
  };

  const colorMap: Record<string, { bg: string; text: string }> = {
    pendiente: {
      bg: tokens.colors.status.pending_bg,
      text: tokens.colors.status.pending,
    },
    'en curso': {
      bg: tokens.colors.status.in_progress_bg,
      text: tokens.colors.status.in_progress,
    },
    terminada: {
      bg: tokens.colors.status.done_bg,
      text: tokens.colors.status.done,
    },
  };

  const sizeMap: Record<string, { padding: string; fontSize: string }> = {
    sm: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
      fontSize: tokens.typography.sizes.caption.size,
    },
    md: {
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      fontSize: tokens.typography.sizes.small.size,
    },
  };

  const { bg, text } = colorMap[status];
  const { padding, fontSize } = sizeMap[size];

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: padding,
    fontFamily: tokens.typography.font_family,
    fontSize: fontSize,
    fontWeight: tokens.typography.weights.medium,
    color: text,
    backgroundColor: bg,
    borderRadius: tokens.radii.pill,
  };

  return <span style={style}>{labelMap[status]}</span>;
}