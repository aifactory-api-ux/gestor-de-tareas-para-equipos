import { tokens } from '../../styles/tokens';

interface NavigationProps {
  activeKey: string;
  isAdmin: boolean;
  userName: string;
  userInitials: string;
  onNavigate: (key: string) => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export default function Navigation({ activeKey, isAdmin, userName, userInitials, onNavigate }: NavigationProps) {
  const navItems: NavItem[] = [
    {
      key: 'mis-tareas',
      label: 'Mis tareas',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      ),
    },
    {
      key: 'vencidas',
      label: 'Tareas vencidas',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      key: 'usuarios',
      label: 'Gestión de usuarios',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      adminOnly: true,
    },
  ];

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  const sidebarStyle: React.CSSProperties = {
    width: tokens.layout.sidebar_width,
    height: '100vh',
    backgroundColor: tokens.colors.neutrals.surface,
    borderRight: `1px solid ${tokens.colors.neutrals.border}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
  };

  const logoStyle: React.CSSProperties = {
    padding: tokens.spacing.xl,
    borderBottom: `1px solid ${tokens.colors.neutrals.border}`,
  };

  const logoTextStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.h2.size,
    fontWeight: tokens.typography.weights.bold,
    color: tokens.colors.primary.base,
  };

  const navStyle: React.CSSProperties = {
    flex: 1,
    padding: tokens.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacing.xs,
  };

  const getNavItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
    padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
    borderRadius: tokens.radii.md,
    cursor: 'pointer',
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    fontWeight: tokens.typography.weights.medium,
    color: isActive ? tokens.colors.primary.base : tokens.colors.neutrals.text_secondary,
    backgroundColor: isActive ? tokens.colors.primary.subtle : 'transparent',
    transition: `all ${tokens.motion_interaction.duration_fast} ${tokens.motion_interaction.easing}`,
  });

  const userSectionStyle: React.CSSProperties = {
    padding: tokens.spacing.lg,
    borderTop: `1px solid ${tokens.colors.neutrals.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacing.md,
  };

  const avatarStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.primary.base,
    color: tokens.colors.neutrals.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    fontWeight: tokens.typography.weights.semibold,
  };

  const userNameStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.body.size,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.neutrals.text_primary,
  };

  const userRoleStyle: React.CSSProperties = {
    fontFamily: tokens.typography.font_family,
    fontSize: tokens.typography.sizes.small.size,
    color: tokens.colors.neutrals.text_tertiary,
  };

  const handleNavHover = (e: React.MouseEvent<HTMLDivElement>, isActive: boolean) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = tokens.colors.neutrals.surface_muted;
    }
  };

  const handleNavLeave = (e: React.MouseEvent<HTMLDivElement>, isActive: boolean) => {
    if (!isActive) {
      e.currentTarget.style.backgroundColor = 'transparent';
    }
  };

  return (
    <div style={sidebarStyle}>
      <div style={logoStyle}>
        <span style={logoTextStyle}>Gestor de Tareas</span>
      </div>

      <nav style={navStyle}>
        {visibleItems.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <div
              key={item.key}
              style={getNavItemStyle(isActive)}
              onClick={() => onNavigate(item.key)}
              onMouseEnter={(e) => handleNavHover(e, isActive)}
              onMouseLeave={(e) => handleNavLeave(e, isActive)}
            >
              <span style={{ color: 'inherit' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={userSectionStyle}>
        <div style={avatarStyle}>{userInitials}</div>
        <div>
          <div style={userNameStyle}>{userName}</div>
          <div style={userRoleStyle}>{isAdmin ? 'Administrador' : 'Miembro'}</div>
        </div>
      </div>
    </div>
  );
}