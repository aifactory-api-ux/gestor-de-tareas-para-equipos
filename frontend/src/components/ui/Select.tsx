import { tokens } from '../../styles/tokens';

interface SelectProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Select({
  label,
  name,
  options,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}: SelectProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.neutrals.text_primary,
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: tokens.spacing.md,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_primary,
    backgroundColor: tokens.colors.neutrals.surface,
    border: `1px solid ${error ? tokens.colors.semantic.danger : tokens.colors.neutrals.border}`,
    borderRadius: tokens.radii.md,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: `border-color ${tokens.motion_interaction.duration_fast} ${tokens.motion_interaction.easing}`,
    boxSizing: 'border-box',
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.semantic.danger,
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={containerStyle}>
      <label htmlFor={name} style={labelStyle}>
        {label}
        {required && <span style={{ color: tokens.colors.semantic.danger }}> *</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        style={selectStyle}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}