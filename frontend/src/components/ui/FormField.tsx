import { tokens } from '../../styles/tokens';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  disabled = false,
}: FormFieldProps) {
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: tokens.spacing.md,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_primary,
    backgroundColor: tokens.colors.neutrals.surface,
    border: `1px solid ${error ? tokens.colors.semantic.danger : tokens.colors.neutrals.border}`,
    borderRadius: tokens.radii.md,
    outline: 'none',
    transition: `border-color ${tokens.motion_interaction.duration_fast} ${tokens.motion_interaction.easing}`,
    boxSizing: 'border-box',
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.semantic.danger,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={containerStyle}>
      <label htmlFor={name} style={labelStyle}>
        {label}
        {required && <span style={{ color: tokens.colors.semantic.danger }}> *</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete}
          disabled={disabled}
          style={inputStyle}
        />
      )}
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
