import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuthContext } from '../context/AuthContext';
import Navigation from '../components/ui/Navigation';
import TaskCard from '../components/ui/TaskCard';
import EmptyState from '../components/ui/EmptyState';
import { tareaService } from '../services/tarea.service';
import type { Tarea, EstadoTarea } from '../types/models';

export default function OverdueTasksPage() {
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuthContext();
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !usuario) {
      navigate('/login');
    }
  }, [authLoading, usuario, navigate]);

  const fetchTareasVencidas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tareaService.getTareasVencidas();
      const tareasConVencimiento = response.tareas.map((tarea) => ({
        ...tarea,
        isOverdue: true,
      }));
      setTareas(tareasConVencimiento);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las tareas vencidas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      fetchTareasVencidas();
    }
  }, [usuario]);

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
    }
  };

  const handleStatusChange = async (id: string, estado: string) => {
    try {
      const tareaActualizada = await tareaService.updateTarea(id, {
        estado: estado as EstadoTarea,
      });
      if (estado === 'terminada') {
        setTareas((prev) => prev.filter((t) => t.id !== id));
      } else {
        setTareas((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...tareaActualizada, isOverdue: true }
              : t
          )
        );
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: tokens.colors.neutrals.canvas
      }}>
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
    marginBottom: tokens.spacing.xl,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h1.size,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.neutrals.text_primary,
    marginBottom: tokens.spacing.sm,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    color: tokens.colors.neutrals.text_secondary,
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
            <h1 style={titleStyle}>Tareas vencidas</h1>
            <p style={subtitleStyle}>
              Tareas que han superado su fecha límite y requieren atención
            </p>
          </div>

          {tareas.length > 0 && (
            <div style={alertStyle}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              <span>
                Hay {tareas.length} tarea{tareas.length > 1 ? 's' : ''} vencida{tareas.length > 1 ? 's' : ''} en el equipo
              </span>
            </div>
          )}

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
          )}
        </div>
      </main>
    </div>
  );
}