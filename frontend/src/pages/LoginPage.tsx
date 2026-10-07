import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuth } from '../hooks/useAuth';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const logoStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: tokens.spacing.xl,
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

  const validateForm = (): boolean => {
    if (!email) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!password) {
      setError('La contraseña es requerida');
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
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div style={containerStyle}>
        <p style={{ color: tokens.colors.neutrals.text_secondary }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={logoStyle}>
          <h1 style={titleStyle}>Gestor de Tareas</h1>
          <p style={subtitleStyle}>Ingresa tus credenciales para continuar</p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
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
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Tu contraseña"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
          <Button
            label={isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            type="submit"
            disabled={isSubmitting}
            onClick={() => {}}
          />
        </form>

        <div style={footerStyle}>
          ¿No tienes cuenta? <Link to="/register" style={linkStyle}>Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
