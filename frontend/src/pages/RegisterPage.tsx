import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.neutrals.canvas,
    padding: tokens.spacing.lg,
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: tokens.colors.neutrals.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing['2xl'],
    boxShadow: tokens.shadows.card,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h1.size,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.neutrals.text_primary,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_secondary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.lg,
  };

  const errorStyle: React.CSSProperties = {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.semantic.danger_bg,
    border: `1px solid ${tokens.colors.semantic.danger_border}`,
    borderRadius: tokens.radii.md,
    color: tokens.colors.semantic.danger,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    textAlign: 'center',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: tokens.spacing.xl,
    textAlign: 'center',
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_secondary,
  };

  const linkStyle: React.CSSProperties = {
    color: tokens.colors.primary.base,
    textDecoration: 'none',
    fontWeight: tokens.typography.weights.medium,
  };

  const passwordRequirementsStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.neutrals.text_tertiary,
    marginTop: `-${tokens.spacing.sm}`,
  };

  const validateForm = (): boolean => {
    if (!nombre) {
      setError('El nombre es requerido');
      return false;
    }
    if (!email) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!password) {
      setError('La contraseña es requerida');
      return false;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register(nombre, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Crear Cuenta</h1>
        <p style={subtitleStyle}>Completa tus datos para registrarte</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <FormField
            label="Nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={setNombre}
            required
            autoComplete="name"
          />
          <FormField
            label="Correo electrónico"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={setEmail}
            required
            autoComplete="email"
          />
          <div>
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={setPassword}
              required
              autoComplete="new-password"
            />
            <p style={passwordRequirementsStyle}>La contraseña debe tener al menos 6 caracteres</p>
          </div>
          <FormField
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
            autoComplete="new-password"
          />
          <Button
            label={isSubmitting ? 'Registrando...' : 'Crear cuenta'}
            type="submit"
            disabled={isSubmitting}
            onClick={() => {}}
          />
        </form>

        <div style={footerStyle}>
          ¿Ya tienes cuenta? <Link to="/login" style={linkStyle}>Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
