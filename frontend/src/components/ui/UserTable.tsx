import { tokens } from '../../styles/tokens';

interface UserTableProps {
  users: Array<{
    id: string;
    nombre: string;
    email: string;
    rol: 'admin' | 'member';
    activo: boolean;
  }>;
  onDeactivate: (id: string) => void;
  onRoleChange: (id: string, rol: 'admin' | 'member') => void;
}

export default function UserTable({ users, onDeactivate, onRoleChange }: UserTableProps) {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'auto',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.neutrals.border}`,
    color: tokens.colors.neutrals.text_secondary,
    fontWeight: tokens.typography.weights.medium,
  };

  const tdStyle: React.CSSProperties = {
    padding: tokens.spacing.md,
    borderBottom: `1px solid ${tokens.colors.neutrals.border}`,
    color: tokens.colors.neutrals.text_primary,
  };

  const selectStyle: React.CSSProperties = {
    padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.neutrals.text_primary,
    backgroundColor: tokens.colors.neutrals.surface,
    border: `1px solid ${tokens.colors.neutrals.border}`,
    borderRadius: tokens.radii.sm,
    cursor: 'pointer',
    outline: 'none',
  };

  const getButtonStyle = (variant: 'danger' | 'secondary'): React.CSSProperties => ({
    padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    fontWeight: tokens.typography.weights.medium,
    borderRadius: tokens.radii.sm,
    cursor: 'pointer',
    outline: 'none',
    transition: `all ${tokens.motion_interaction.duration_fast} ${tokens.motion_interaction.easing}`,
    backgroundColor: variant === 'danger' ? tokens.colors.semantic.danger_bg : tokens.colors.neutrals.surface,
    color: variant === 'danger' ? tokens.colors.semantic.danger : tokens.colors.neutrals.text_secondary,
    border: variant === 'danger' ? `1px solid ${tokens.colors.semantic.danger_border}` : `1px solid ${tokens.colors.neutrals.border}`,
  });

  const getRoleBadgeStyle = (isAdmin: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.caption.size,
    fontWeight: tokens.typography.weights.medium,
    borderRadius: tokens.radii.pill,
    backgroundColor: isAdmin ? tokens.colors.primary.subtle : tokens.colors.neutrals.surface_muted,
    color: isAdmin ? tokens.colors.primary.base : tokens.colors.neutrals.text_secondary,
  });

  const getStatusBadgeStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.caption.size,
    fontWeight: tokens.typography.weights.medium,
    borderRadius: tokens.radii.pill,
    backgroundColor: isActive ? tokens.colors.semantic.success_bg : tokens.colors.semantic.danger_bg,
    color: isActive ? tokens.colors.semantic.success : tokens.colors.semantic.danger,
  });

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Correo electrónico</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Estado</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={tdStyle}>{user.nombre}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>
                <span style={getRoleBadgeStyle(user.rol === 'admin')}>
                  {user.rol === 'admin' ? 'Administrador' : 'Miembro'}
                </span>
              </td>
              <td style={tdStyle}>
                <span style={getStatusBadgeStyle(user.activo)}>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={tdStyle}>
                <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
                  <select
                    value={user.rol}
                    onChange={(e) => onRoleChange(user.id, e.target.value as 'admin' | 'member')}
                    style={selectStyle}
                  >
                    <option value="member">Miembro</option>
                    <option value="admin">Administrador</option>
                  </select>
                  {user.activo ? (
                    <button
                      onClick={() => onDeactivate(user.id)}
                      style={getButtonStyle('danger')}
                    >
                      Desactivar
                    </button>
                  ) : (
                    <button
                      onClick={() => onDeactivate(user.id)}
                      style={getButtonStyle('secondary')}
                    >
                      Activar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}