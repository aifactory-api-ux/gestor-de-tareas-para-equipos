import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../styles/tokens';
import { useAuthContext } from '../context/AuthContext';
import { useTareas } from '../hooks/useTareas';
import Navigation from '../components/ui/Navigation';
import TaskCard from '../components/ui/TaskCard';
import Select from '../components/ui/Select';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import type { EstadoTarea } from '../types/models';

export default function MyTasksPage() {
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading } = useAuthContext();
  const { tareas, loading, error, fetchTareas, updateTarea } = useTareas();
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');

  useEffect(() => {
    if (!authLoading && !usuario) {
      navigate('/login');
    }
  }, [authLoading, usuario, navigate]);

  useEffect(() => {
    if (usuario) {
      fetchTareas();
    }
  }, [usuario, fetchTareas]);

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

  const tareasFiltradas = useMemo(() => {
    let filtered = [...tareas];
    
    if (filtroEstado) {
      filtered = filtered.filter((t) => t.estado === filtroEstado);
    }
    
    if (filtroPrioridad) {
      filtered = filtered.filter((t) => t.prioridad === filtroPrioridad);
    }
    
    const prioridadOrden: Record<string, number> = { alta: 0, media: 1, baja: 2 };
    return filtered.sort((a, b) => {
      const diffPrioridad = prioridadOrden[a.prioridad] - prioridadOrden[b.prioridad];
      if (diffPrioridad !== 0) return diffPrioridad;
      return new Date(a.fecha_limite).getTime() - new Date(b.fecha_limite).getTime();
    });
  }, [tareas, filtroEstado, filtroPrioridad]);

  const handleStatusChange = async (id: string, estado: string) => {
    try {
      await updateTarea(id, { estado: estado as EstadoTarea });
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h1.size,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.neutrals.text_primary,
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.xl,
  };

  const taskListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.md,
  };

  const estadoOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en curso', label: 'En curso' },
    { value: 'terminada', label: 'Terminada' },
  ];

  const prioridadOptions = [
    { value: '', label: 'Todas las prioridades' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' },
  ];

  return (
    <div style={layoutStyle}>
      <Navigation
        activeKey="mis-tareas"
        isAdmin={usuario.rol === 'admin'}
        userName={usuario.nombre}
        userInitials={getUserInitials(usuario.nombre)}
        onNavigate={handleNavigate}
      />
      <main style={mainStyle}>
        <div style={contentStyle}>
          <div style={headerStyle}>
            <h1 style={titleStyle}>Mis tareas</h1>
            <Button
              label="Nueva tarea"
              variant="primary"
              size="md"
              onClick={() => navigate('/crear-tarea')}
            />
          </div>

          <div style={filtersStyle}>
            <div style={{ width: '200px' }}>
              <Select
                label="Estado"
                name="estado"
                options={estadoOptions}
                value={filtroEstado}
                onChange={setFiltroEstado}
              />
            </div>
            <div style={{ width: '200px' }}>
              <Select
                label="Prioridad"
                name="prioridad"
                options={prioridadOptions}
                value={filtroPrioridad}
                onChange={setFiltroPrioridad}
              />
            </div>
          </div>

          {loading ? (
            <p style={{ color: tokens.colors.neutrals.text_secondary }}>Cargando tareas...</p>
          ) : error ? (
            <p style={{ color: tokens.colors.semantic.danger }}>{error}</p>
          ) : tareasFiltradas.length === 0 ? (
            <EmptyState
              title="No hay tareas"
              description="Crea tu primera tarea para empezar a organizarte"
              actionLabel="Crear tarea"
              onAction={() => navigate('/crear-tarea')}
            />
          ) : (
            <div style={taskListStyle}>
              {tareasFiltradas.map((tarea) => (
                <TaskCard
                  key={tarea.id}
                  task={tarea}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}