import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuthContext } from '../context/AuthContext';
import { useTareasDashboard } from '../hooks/useTareasDashboard';
import { useTareasVencidas } from '../hooks/useTareasVencidas';
import Navigation from '../components/ui/Navigation';
import Card from '../components/ui/Card';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuthContext();
  const { dashboard, loading, fetchDashboard } = useTareasDashboard();
  const { tareas: tareasVencidas, fetchTareasVencidas } = useTareasVencidas();

  useEffect(() => {
    if (!authLoading && !usuario) {
      navigate('/login');
    }
  }, [authLoading, usuario, navigate]);

  useEffect(() => {
    if (usuario) {
      fetchDashboard();
      fetchTareasVencidas();
    }
  }, [usuario, fetchDashboard, fetchTareasVencidas]);

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleNavigate = (key: string) => {
    if (key === 'usuarios' && usuario?.rol !== 'admin') {
      return;
    }
    if (key === 'mis-tareas') {
      navigate('/mis-tareas');
    } else if (key === 'vencidas') {
      navigate('/vencidas');
    } else if (key === 'usuarios') {
      navigate('/usuarios');
    } else if (key === 'crear-tarea') {
      navigate('/crear-tarea');
    }
  };

  if (authLoading) {
    return (
      <div style={loadingContainerStyle}>
        <p style={{ color: tokens.colors.neutrals.text_secondary }}>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  const vencidasCount = tareasVencidas.length;

  const formatFecha = () => {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={layoutStyle}>
        <Navigation
          activeKey="dashboard"
          isAdmin={usuario.rol === 'admin'}
          userName={usuario.nombre}
          userInitials={getUserInitials(usuario.nombre)}
          onNavigate={handleNavigate}
        />
        <main style={mainStyle}>
          <div style={contentStyle}>
            <header style={headerStyle}>
              <h1 style={titleStyle}>Hola, {usuario.nombre}</h1>
              <p style={dateStyle}>{formatFecha()}</p>
            </header>
            <div style={loadingStatsStyle}>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} padding="lg" elevation="card">
                  <div style={loadingStatStyle}>
                    <div style={loadingBarStyle} />
                    <div style={loadingTextStyle} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={layoutStyle}>
      <Navigation
        activeKey="dashboard"
        isAdmin={usuario.rol === 'admin'}
        userName={usuario.nombre}
        userInitials={getUserInitials(usuario.nombre)}
        onNavigate={handleNavigate}
      />
      <main style={mainStyle}>
        <div style={contentStyle}>
          <header style={headerStyle}>
            <h1 style={titleStyle}>
              Hola, {usuario.nombre}
            </h1>
            <p style={dateStyle}>{formatFecha()}</p>
          </header>

          {vencidasCount > 0 && (
            <div style={alertStyle}>
              <span style={alertIconStyle}>⚠️</span>
              <span style={alertTextStyle}>
                Tienes <strong>{vencidasCount}</strong> tarea{vencidasCount > 1 ? 's' : ''} vencida{vencidasCount > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => navigate('/vencidas')}
                style={alertButtonStyle}
              >
                Ver tareas vencidas
              </button>
            </div>
          )}

          <section style={statsGridStyle}>
            <Card padding="lg" elevation="card">
              <div style={statCardInnerStyle}>
                <div style={statContentStyle}>
                  <span style={statNumberStyle}>{dashboard?.total ?? 0}</span>
                  <span style={statLabelStyle}>Total</span>
                </div>
                <div style={{ ...statIndicatorStyle, backgroundColor: tokens.colors.primary.base }} />
              </div>
            </Card>

            <Card padding="lg" elevation="card">
              <div style={statCardInnerStyle}>
                <div style={statContentStyle}>
                  <span style={{ ...statNumberStyle, color: tokens.colors.status.in_progress }}>
                    {dashboard?.en_curso ?? 0}
                  </span>
                  <span style={statLabelStyle}>En curso</span>
                </div>
                <div style={{ ...statIndicatorStyle, backgroundColor: tokens.colors.status.in_progress }} />
              </div>
            </Card>

            <Card padding="lg" elevation="card">
              <div style={statCardInnerStyle}>
                <div style={statContentStyle}>
                  <span style={{ ...statNumberStyle, color: tokens.colors.semantic.danger }}>
                    {vencidasCount}
                  </span>
                  <span style={statLabelStyle}>Vencidas</span>
                </div>
                <div style={{ ...statIndicatorStyle, backgroundColor: tokens.colors.semantic.danger }} />
              </div>
            </Card>

            <Card padding="lg" elevation="card">
              <div style={statCardInnerStyle}>
                <div style={statContentStyle}>
                  <span style={{ ...statNumberStyle, color: tokens.colors.status.done }}>
                    {dashboard?.terminadas ?? 0}
                  </span>
                  <span style={statLabelStyle}>Terminadas</span>
                </div>
                <div style={{ ...statIndicatorStyle, backgroundColor: tokens.colors.status.done }} />
              </div>
            </Card>
          </section>

          <section style={quickActionsStyle}>
            <h2 style={sectionTitleStyle}>Acciones rápidas</h2>
            <div style={quickActionsGridStyle}>
              <button
                onClick={() => navigate('/crear-tarea')}
                style={quickActionButtonStyle}
              >
                + Nueva tarea
              </button>
              <button
                onClick={() => navigate('/mis-tareas')}
                style={quickActionSecondaryStyle}
              >
                Ver mis tareas
              </button>
              {usuario.rol === 'admin' && (
                <button
                  onClick={() => navigate('/usuarios')}
                  style={quickActionSecondaryStyle}
                >
                  Gestionar usuarios
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: tokens.colors.neutrals.canvas,
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: tokens.colors.neutrals.canvas,
};

const mainStyle: React.CSSProperties = {
  flex: 1,
  marginLeft: tokens.layout.sidebar_width,
  padding: tokens.spacing['2xl'],
};

const contentStyle: React.CSSProperties = {
  maxWidth: tokens.layout.content_max_width,
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  marginBottom: tokens.spacing.xl,
};

const titleStyle: React.CSSProperties = {
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.h1.size,
  fontWeight: tokens.typography.weights.bold,
  color: tokens.colors.neutrals.text_primary,
  margin: 0,
  marginBottom: tokens.spacing.xs,
};

const dateStyle: React.CSSProperties = {
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.body.size,
  color: tokens.colors.neutrals.text_secondary,
  margin: 0,
  textTransform: 'capitalize',
};

const alertStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: tokens.spacing.md,
  padding: tokens.spacing.lg,
  backgroundColor: tokens.colors.semantic.danger_bg,
  border: `1px solid ${tokens.colors.semantic.danger_border}`,
  borderRadius: tokens.radii.md,
  marginBottom: tokens.spacing.xl,
};

const alertIconStyle: React.CSSProperties = {
  fontSize: '20px',
};

const alertTextStyle: React.CSSProperties = {
  flex: 1,
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.body.size,
  color: tokens.colors.semantic.danger,
};

const alertButtonStyle: React.CSSProperties = {
  padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.small.size,
  fontWeight: tokens.typography.weights.medium,
  color: tokens.colors.neutrals.white,
  backgroundColor: tokens.colors.semantic.danger,
  border: 'none',
  borderRadius: tokens.radii.sm,
  cursor: 'pointer',
};

const statsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: tokens.spacing.lg,
  marginBottom: tokens.spacing.xl,
};

const loadingStatsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: tokens.spacing.lg,
};

const loadingStatStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.sm,
};

const loadingBarStyle: React.CSSProperties = {
  width: '48px',
  height: '36px',
  backgroundColor: tokens.colors.neutrals.surface_strong,
  borderRadius: tokens.radii.sm,
};

const loadingTextStyle: React.CSSProperties = {
  width: '64px',
  height: '14px',
  backgroundColor: tokens.colors.neutrals.surface_strong,
  borderRadius: tokens.radii.sm,
};

const statCardInnerStyle: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

const statContentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.spacing.xs,
};

const statNumberStyle: React.CSSProperties = {
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.display.size,
  fontWeight: tokens.typography.weights.bold,
  color: tokens.colors.neutrals.text_primary,
  lineHeight: tokens.typography.sizes.display.line_height,
};

const statLabelStyle: React.CSSProperties = {
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.caption.size,
  fontWeight: tokens.typography.weights.medium,
  color: tokens.colors.neutrals.text_tertiary,
  textTransform: 'uppercase',
  letterSpacing: tokens.typography.sizes.caption.letter_spacing,
};

const statIndicatorStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '4px',
  height: '100%',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.h2.size,
  fontWeight: tokens.typography.weights.semibold,
  color: tokens.colors.neutrals.text_primary,
  margin: 0,
  marginBottom: tokens.spacing.md,
};

const quickActionsStyle: React.CSSProperties = {
  marginTop: tokens.spacing.xl,
};

const quickActionsGridStyle: React.CSSProperties = {
  display: 'flex',
  gap: tokens.spacing.md,
  flexWrap: 'wrap',
};

const quickActionButtonStyle: React.CSSProperties = {
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.body.size,
  fontWeight: tokens.typography.weights.medium,
  color: tokens.colors.neutrals.white,
  backgroundColor: tokens.colors.primary.base,
  border: 'none',
  borderRadius: tokens.radii.md,
  cursor: 'pointer',
};

const quickActionSecondaryStyle: React.CSSProperties = {
  padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
  fontFamily: tokens.typography.font_family,
  fontSize: tokens.typography.sizes.body.size,
  fontWeight: tokens.typography.weights.medium,
  color: tokens.colors.neutrals.text_primary,
  backgroundColor: tokens.colors.neutrals.surface,
  border: `1px solid ${tokens.colors.neutrals.border}`,
  borderRadius: tokens.radii.md,
  cursor: 'pointer',
};
