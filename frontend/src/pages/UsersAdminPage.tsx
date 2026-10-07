import { CSSProperties } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuthContext } from '../context/AuthContext';
import { useUsuarios } from '../hooks/useUsuarios';
import Navigation from '../components/ui/Navigation';
import UserTable from '../components/ui/UserTable';
import Card from '../components/ui/Card';

export default function UsersAdminPage() {
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuthContext();
  const { usuarios, loading, error, fetchUsuarios, updateRol, deactivateUser } = useUsuarios();

  useEffect(() => {
    if (!authLoading && !usuario) {
      navigate('/login');
    }
  }, [authLoading, usuario, navigate]);

  useEffect(() => {
    if (usuario && usuario.rol === 'admin') {
      fetchUsuarios();
    }
  }, [usuario, fetchUsuarios]);

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleNavigate = (key: string) => {
    if (key === 'mis-tareas') {
      navigate('/dashboard');
    } else if (key === 'vencidas') {
      navigate('/vencidas');
    }
  };

  if (authLoading) {
    return (
      <div style={loadingContainerStyle as CSSProperties}>
        <p style={loadingTextStyle as CSSProperties}>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  if (usuario.rol !== 'admin') {
    return (
      <div style={layoutStyle as CSSProperties}>
        <Navigation
          activeKey="usuarios"
          isAdmin={false}
          userName={usuario.nombre}
          userInitials={getUserInitials(usuario.nombre)}
          onNavigate={handleNavigate}
        />
        <main style={mainStyle as CSSProperties}>
          <div style={contentStyle as CSSProperties}>
            <div style={accessDeniedStyle as CSSProperties}>
              <h2 style={accessDeniedTitleStyle as CSSProperties}>Acceso denegado</h2>
              <p style={accessDeniedTextStyle as CSSProperties}>No tienes permisos para acceder a esta sección.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleRoleChange = async (id: string, rol: 'admin' | 'member') => {
    try {
      await updateRol(id, rol);
    } catch {
      // Error ya manejado por el hook
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivateUser(id);
    } catch {
      // Error ya manejado por el hook
    }
  };

  return (
    <div style={layoutStyle as CSSProperties}>
      <Navigation
        activeKey="usuarios"
        isAdmin={true}
        userName={usuario.nombre}
        userInitials={getUserInitials(usuario.nombre)}
        onNavigate={handleNavigate}
      />
      <main style={mainStyle as CSSProperties}>
        <div style={contentStyle as CSSProperties}>
          <div style={headerStyle as CSSProperties}>
            <h1 style={titleStyle as CSSProperties}>Gestión de usuarios</h1>
            <p style={subtitleStyle as CSSProperties}>Administra los usuarios del equipo, sus roles y estados.</p>
          </div>

          <Card padding="lg" elevation="card">
            {loading ? (
              <p style={loadingTextStyle as CSSProperties}>Cargando usuarios...</p>
            ) : error ? (
              <p style={errorTextStyle as CSSProperties}>{error}</p>
            ) : usuarios.length === 0 ? (
              <p style={emptyTextStyle as CSSProperties}>No hay usuarios registrados.</p>
            ) : (
              <UserTable
                users={usuarios.map((u) => ({
                  id: u.id,
                  nombre: u.nombre,
                  email: u.email,
                  rol: u.rol,
                  activo: u.activo,
                }))}
                onDeactivate={handleDeactivate}
                onRoleChange={handleRoleChange}
              />
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

const layoutStyle = `
  display: flex;
  min-height: 100vh;
  background-color: ${tokens.colors.neutrals.canvas};
`;

const mainStyle = `
  flex: 1;
  margin-left: ${tokens.layout.sidebar_width};
  padding: ${tokens.spacing['2xl']};
`;

const contentStyle = `
  max-width: ${tokens.layout.content_max_width};
  margin: 0 auto;
`;

const headerStyle = `
  margin-bottom: ${tokens.spacing.xl};
`;

const titleStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.h1.size};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.neutrals.text_primary};
  margin: 0 0 ${tokens.spacing.sm} 0;
`;

const subtitleStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.body.size};
  color: ${tokens.colors.neutrals.text_secondary};
  margin: 0;
`;

const loadingContainerStyle = `
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${tokens.colors.neutrals.canvas};
`;

const loadingTextStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.body.size};
  color: ${tokens.colors.neutrals.text_secondary};
`;

const errorTextStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.body.size};
  color: ${tokens.colors.semantic.danger};
`;

const emptyTextStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.body.size};
  color: ${tokens.colors.neutrals.text_tertiary};
  text-align: center;
  padding: ${tokens.spacing.xl};
`;

const accessDeniedStyle = `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${tokens.spacing['3xl']};
  text-align: center;
`;

const accessDeniedTitleStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.h1.size};
  font-weight: ${tokens.typography.weights.bold};
  color: ${tokens.colors.semantic.danger};
  margin: 0 0 ${tokens.spacing.md} 0;
`;

const accessDeniedTextStyle = `
  font-family: ${tokens.typography.font_family};
  font-size: ${tokens.typography.sizes.body.size};
  color: ${tokens.colors.neutrals.text_secondary};
  margin: 0;
`;