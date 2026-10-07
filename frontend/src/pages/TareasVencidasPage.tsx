import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuthContext } from '../context/AuthContext';
import { useTareasVencidas } from '../hooks/useTareasVencidas';
import Navigation from '../components/ui/Navigation';
import TaskCard from '../components/ui/TaskCard';
import EmptyState from '../components/ui/EmptyState';
import type { EstadoTarea } from '../types/models';
import { tareaService } from '../services/tarea.service';

export default function TareasVencidasPage() {
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuthContext();
  const { tareas, loading, error, fetchTareasVencidas } = useTareasVencidas();

  useEffect(() => {
    if (!authLoading && !usuario) {
      navigate('/login');
    }
  }, [authLoading, usuario, navigate]);

  useEffect(() => {
    if (usuario) {
      fetchTareasVencidas();
    }
  }, [usuario, fetchTareasVencidas]);

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

  const handleStatusChange = async (id: string, estado: string) => {
    try {
      await tareaService.updateTarea(id, {
        estado: estado as EstadoTarea,
      });
      if (estado === 'terminada') {
        fetchTareasVencidas();
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
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

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.xl,
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h1.size,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.neutrals.text_primary,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_secondary,
    margin: 0,
  };

  const countBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    padding: `0 ${tokens.spacing.md}`,
    backgroundColor: tokens.colors.semantic.danger,
    color: tokens.colors.neutrals.white,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body_medium.size,
    fontWeight: tokens.typography.weights.semibold,
    borderRadius: tokens.radii.pill,
  };

  const alertStyle: React.CSSProperties = {
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.semantic.danger_bg,
    border: `1px solid ${tokens.colors.semantic.danger_border}`,
    borderRadius: tokens.radii.md,
    marginBottom: tokens.spacing.xl,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.semantic.danger,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  };

  const taskListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.md,
  };

  return (
    <div style={layoutStyle}>
      <Navigation
        activeKey="vencidas"
        isAdmin={usuario.rol === 'admin'}
        userName={usuario.nombre}
        userInitials={getUserInitials(usuario.nombre)}
        onNavigate={handleNavigate}
      />
      <main style={mainStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <div style={headerLeftStyle}>
              <h1 style={titleStyle}>Tareas vencidas</h1>
              <p style={subtitleStyle}>
                Tareas que han superado su fecha límite y requieren atención
              </p>
            </div>
            {tareas.length > 0 && (
              <div style={countBadgeStyle}>
                {tareas.length}
              </div>
            )}
          </div>

          {loading ? (
            <p style={{ color: tokens.colors.neutrals.text_secondary }}>Cargando tareas...</p>
          ) : error ? (
            <p style={{ color: tokens.colors.semantic.danger }}>{error}</p>
          ) : tareas.length === 0 ? (
            <EmptyState
              title="No hay tareas vencidas"
              description="¡Buen trabajo! No hay tareas vencidas en el equipo"
            />
          ) : (
            <>
              <div style={alertStyle}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span>
                  Hay {tareas.length} tarea{tareas.length > 1 ? 's' : ''} vencida{tareas.length > 1 ? 's' : ''} en el equipo
                </span>
              </div>
              <div style={taskListStyle}>
                {tareas.map((tarea) => (
                  <TaskCard
                    key={tarea.id}
                    task={tarea}
                    onStatusChange={handleStatusChange}
                    showAssignee
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: tokens.colors.neutrals.canvas,
};
