import { tokens } from '../../styles/tokens';

interface PriorityBadgeProps {
  priority: 'alta' | 'media' | 'baja';
  size?: 'sm' | 'md';
}

export default function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const labelMap: Record<string, string> = {
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja',
  };

  const colorMap: Record<string, { bg: string; text: string }> = {
    alta: {
      bg: tokens.colors.priority.high_bg,
      text: tokens.colors.priority.high,
    },
    media: {
      bg: tokens.colors.priority.medium_bg,
      text: tokens.colors.priority.medium,
    },
    baja: {
      bg: tokens.colors.priority.low_bg,
      text: tokens.colors.priority.low,
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

  const { bg, text } = colorMap[priority];
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

  return <span style={style}>{labelMap[priority]}</span>;
}