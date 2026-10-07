import { tokens } from '../styles/tokens';
import Card from './ui/Card';
import StatusBadge from './ui/StatusBadge';
import PriorityBadge from './ui/PriorityBadge';

interface TaskCardProps {
  task: {
    id: string;
    titulo: string;
    descripcion?: string | null;
    nombre_usuario?: string;
    fecha_limite: string;
    prioridad: 'alta' | 'media' | 'baja';
    estado: 'pendiente' | 'en curso' | 'terminada';
    isOverdue?: boolean;
  };
  onStatusChange: (id: string, estado: string) => void;
  onEdit?: (id: string) => void;
  showAssignee?: boolean;
}

export default function TaskCard({ task, onStatusChange, onEdit, showAssignee = false }: TaskCardProps) {
  const cardStyle: React.CSSProperties = {
    borderLeft: task.isOverdue ? `4px solid ${tokens.colors.semantic.danger}` : '4px solid transparent',
    transition: 'border-color 0.2s ease',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacing.lg,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.sm,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.neutrals.text_primary,
    margin: 0,
  };

  const descStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.neutrals.text_secondary,
    margin: 0,
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    flexWrap: 'wrap',
  };

  const fechaStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: task.isOverdue ? tokens.colors.semantic.danger : tokens.colors.neutrals.text_tertiary,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  };

  const selectStyle: React.CSSProperties = {
    padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.neutrals.text_primary,
    backgroundColor: tokens.colors.neutrals.surface,
    border: `1px solid ${tokens.colors.neutrals.border}`,
    borderRadius: tokens.radii.sm,
    cursor: 'pointer',
    outline: 'none',
  };

  const assigneeStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.neutrals.text_tertiary,
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value);
  };

  return (
    <Card padding="md" elevation="subtle">
      <div style={cardStyle}>
        <div style={containerStyle}>
          <div style={mainStyle}>
            <h3 style={titleStyle}>{task.titulo}</h3>
            {task.descripcion && <p style={descStyle}>{task.descripcion}</p>}
            <div style={metaStyle}>
              <StatusBadge status={task.estado} size="sm" />
              <PriorityBadge priority={task.prioridad} size="sm" />
              <span style={fechaStyle}>
                {new Date(task.fecha_limite).toLocaleDateString('es-ES')}
              </span>
              {showAssignee && task.nombre_usuario && (
                <span style={assigneeStyle}>• {task.nombre_usuario}</span>
              )}
            </div>
          </div>
          <div style={actionsStyle}>
            <select
              value={task.estado}
              onChange={handleStatusChange}
              style={selectStyle}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en curso">En curso</option>
              <option value="terminada">Terminada</option>
            </select>
            {onEdit && (
              <button
                onClick={() => onEdit(task.id)}
                style={{
                  padding: tokens.spacing.sm,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: tokens.colors.primary.base,
                  fontFamily: tokens.typography.font_family,
                  fontSize: tokens.typography.sizes.small.size,
                }}
              >
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}