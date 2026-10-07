# SPEC.md — Gestor de Tareas para Equipos

## 1. TECHNOLOGY STACK

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20 |
| Backend Framework | NestJS | 10.x |
| Database | PostgreSQL | 15 |
| ORM | TypeORM | 0.3.x |
| Frontend Framework | React | 18 |
| Build Tool | Vite | 5.x |
| Language (Backend) | TypeScript | 5.x |
| Language (Frontend) | TypeScript | 5.x |
| Authentication | JWT (jsonwebtoken) | 9.x |
| Password Hashing | bcrypt | 5.x |
| Validation | class-validator, class-transformer | 0.5.x, 0.4.x |
| Containerization | Docker Compose | 2.x |
| CSS | Tailwind CSS | 3.x |

---

## 2. DATA CONTRACTS

### 2.1 Backend Data Models (Pydantic-like TypeScript for NestJS)

```typescript
// backend/src/usuario/entities/usuario.entity.ts
export class Usuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  rol: 'admin' | 'member';
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export class UsuarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'member';
  activo: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export class UsuarioCreate {
  nombre: string;
  email: string;
  password: string;
}

export class UsuarioLogin {
  email: string;
  password: string;
}
```

```typescript
// backend/src/tarea/entities/tarea.entity.ts
export type PrioridadTarea = 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en curso' | 'terminada';

export class Tarea {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: PrioridadTarea;
  fecha_limite: Date;
  estado: EstadoTarea;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

export class TareaResponse {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: PrioridadTarea;
  fecha_limite: Date;
  estado: EstadoTarea;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  // Computed field from frontend perspective
  isOverdue: boolean;
  nombre_usuario?: string;
}

export class TareaCreate {
  titulo: string;
  descripcion?: string;
  prioridad: PrioridadTarea;
  fecha_limite: string; // ISO date string
}

export class TareaUpdate {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadTarea;
  fecha_limite?: string;
  estado?: EstadoTarea;
}

export class TareaFiltro {
  estado?: EstadoTarea;
  prioridad?: PrioridadTarea;
  usuario_id?: string;
}
```

### 2.2 Frontend Data Models (TypeScript Interfaces)

```typescript
// frontend/src/types/models.ts
export type PrioridadTarea = 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en curso' | 'terminada';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'member';
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface Tarea {
  id: string;
  usuario_id: string;
  titulo: string;
  descripcion: string | null;
  prioridad: PrioridadTarea;
  fecha_limite: string;
  estado: EstadoTarea;
  fecha_creacion: string;
  fecha_actualizacion: string;
  isOverdue?: boolean;
  nombre_usuario?: string;
}

export interface TareaCreatePayload {
  titulo: string;
  descripcion?: string;
  prioridad: PrioridadTarea;
  fecha_limite: string;
}

export interface TareaUpdatePayload {
  titulo?: string;
  descripcion?: string;
  prioridad?: PrioridadTarea;
  fecha_limite?: string;
  estado?: EstadoTarea;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
```

---

## 3. API ENDPOINTS

### 3.1 Authentication Endpoints

#### POST /auth/login
- **Description:** Authenticate user and return JWT token
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response (200):**
  ```json
  {
    "access_token": "string",
    "usuario": {
      "id": "string",
      "nombre": "string",
      "email": "string",
      "rol": "admin | member",
      "activo": true,
      "fecha_creacion": "ISO date",
      "fecha_actualizacion": "ISO date"
    }
  }
  ```
- **Error Responses:** 401 Unauthorized

#### POST /auth/register
- **Description:** Register new team member
- **Request Body:**
  ```json
  {
    "nombre": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response (201):**
  ```json
  {
    "id": "string",
    "nombre": "string",
    "email": "string",
    "rol": "member",
    "activo": true,
    "fecha_creacion": "ISO date",
    "fecha_actualizacion": "ISO date"
  }
  ```
- **Error Responses:** 400 Bad Request (validation), 409 Conflict (email exists)

### 3.2 Task Endpoints (Protected — require JWT)

#### GET /tareas
- **Description:** Get tasks for the authenticated user (own tasks)
- **Query Parameters:**
  - `estado` (optional): 'pendiente' | 'en curso' | 'terminada'
  - `prioridad` (optional): 'alta' | 'media' | 'baja'
- **Response (200):**
  ```json
  {
    "tareas": [
      {
        "id": "string",
        "usuario_id": "string",
        "titulo": "string",
        "descripcion": "string | null",
        "prioridad": "alta | media | baja",
        "fecha_limite": "ISO date",
        "estado": "pendiente | en curso | terminada",
        "fecha_creacion": "ISO date",
        "fecha_actualizacion": "ISO date",
        "isOverdue": "boolean"
      }
    ],
    "total": "number"
  }
  ```

#### GET /tareas/vencidas
- **Description:** Get all overdue tasks for the entire team (admin and member view)
- **Response (200):**
  ```json
  {
    "tareas": [
      {
        "id": "string",
        "usuario_id": "string",
        "titulo": "string",
        "descripcion": "string | null",
        "prioridad": "alta | media | baja",
        "fecha_limite": "ISO date",
        "estado": "pendiente | en curso",
        "fecha_creacion": "ISO date",
        "fecha_actualizacion": "ISO date",
        "isOverdue": true,
        "nombre_usuario": "string"
      }
    ],
    "total": "number"
  }
  ```

#### GET /tareas/dashboard
- **Description:** Get dashboard summary metrics
- **Response (200):**
  ```json
  {
    "total_tareas": "number",
    "pendientes": "number",
    "en_curso": "number",
    "terminadas": "number",
    "vencidas": "number",
    "vencidas_recientes": [
      {
        "id": "string",
        "titulo": "string",
        "fecha_limite": "ISO date",
        "nombre_usuario": "string",
        "prioridad": "alta | media | baja"
      }
    ],
    "proximas_vencer": [
      {
        "id": "string",
        "titulo": "string",
        "fecha_limite": "ISO date",
        "prioridad": "alta | media | baja"
      }
    ]
  }
  ```

#### POST /tareas
- **Description:** Create a new task for the authenticated user
- **Request Body:**
  ```json
  {
    "titulo": "string",
    "descripcion": "string (optional)",
    "prioridad": "alta | media | baja",
    "fecha_limite": "YYYY-MM-DD"
  }
  ```
- **Response (201):**
  ```json
  {
    "id": "string",
    "usuario_id": "string",
    "titulo": "string",
    "descripcion": "string | null",
    "prioridad": "alta | media | baja",
    "fecha_limite": "ISO date",
    "estado": "pendiente",
    "fecha_creacion": "ISO date",
    "fecha_actualizacion": "ISO date",
    "isOverdue": false
  }
  ```
- **Error Responses:** 400 Bad Request

#### GET /tareas/:id
- **Description:** Get a specific task by ID
- **Response (200):** Tarea object
- **Error Responses:** 404 Not Found

#### PATCH /tareas/:id
- **Description:** Update a task (title, description, priority, deadline, status)
- **Request Body:**
  ```json
  {
    "titulo": "string (optional)",
    "descripcion": "string (optional)",
    "prioridad": "alta | media | baja (optional)",
    "fecha_limite": "YYYY-MM-DD (optional)",
    "estado": "pendiente | en curso | terminada (optional)"
  }
  ```
- **Response (200):** Updated Tarea object
- **Error Responses:** 400 Bad Request, 404 Not Found

#### DELETE /tareas/:id
- **Description:** Delete a task
- **Response (204):** No content
- **Error Responses:** 404 Not Found

### 3.3 User Management Endpoints (Admin Only)

#### GET /usuarios
- **Description:** Get all team members (admin only)
- **Response (200):**
  ```json
  {
    "usuarios": [
      {
        "id": "string",
        "nombre": "string",
        "email": "string",
        "rol": "admin | member",
        "activo": true,
        "fecha_creacion": "ISO date",
        "fecha_actualizacion": "ISO date"
      }
    ],
    "total": "number"
  }
  ```

#### PATCH /usuarios/:id/rol
- **Description:** Change user role (admin only)
- **Request Body:**
  ```json
  {
    "rol": "admin | member"
  }
  ```
- **Response (200):** Updated Usuario object
- **Error Responses:** 400 Bad Request, 403 Forbidden, 404 Not Found

#### PATCH /usuarios/:id/desactivar
- **Description:** Deactivate a user account (admin only)
- **Response (200):** Updated Usuario object
- **Error Responses:** 400 Bad Request, 403 Forbidden, 404 Not Found

#### GET /usuarios/perfil
- **Description:** Get current user profile
- **Response (200):** UsuarioResponse object

---

## 4. FILE STRUCTURE

```
gestor-tareas/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       │
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── jwt.strategy.ts
│       │   ├── jwt-auth.guard.ts
│       │   └── dto/
│       │       ├── login.dto.ts
│       │       └── register.dto.ts
│       │
│       ├── usuario/
│       │   ├── usuario.module.ts
│       │   ├── usuario.controller.ts
│       │   ├── usuario.service.ts
│       │   ├── usuario.entity.ts
│       │   └── dto/
│       │       ├── update-rol.dto.ts
│       │       └── usuario-response.dto.ts
│       │
│       ├── tarea/
│       │   ├── tarea.module.ts
│       │   ├── tarea.controller.ts
│       │   ├── tarea.service.ts
│       │   ├── tarea.entity.ts
│       │   └── dto/
│       │       ├── create-tarea.dto.ts
│       │       ├── update-tarea.dto.ts
│       │       └── tarea-response.dto.ts
│       │
│       └── common/
│           ├── decorators/
│           │   └── current-user.decorator.ts
│           └── guards/
│               └── roles.guard.ts
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css
        │
        ├── types/
        │   └── models.ts
        │
        ├── styles/
        │   └── tokens.ts
        │
        ├── services/
        │   ├── api.ts
        │   ├── auth.service.ts
        │   ├── tarea.service.ts
        │   └── usuario.service.ts
        │
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useTareas.ts
        │   └── useUsuarios.ts
        │
        ├── components/
        │   └── ui/
        │       ├── Navigation.tsx
        │       ├── Button.tsx
        │       ├── TaskCard.tsx
        │       ├── Card.tsx
        │       ├── PriorityBadge.tsx
        │       ├── StatusBadge.tsx
        │       ├── FormField.tsx
        │       ├── Select.tsx
        │       ├── UserTable.tsx
        │       └── EmptyState.tsx
        │
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── MyTasksPage.tsx
        │   ├── OverdueTasksPage.tsx
        │   ├── CreateTaskPage.tsx
        │   └── UserManagementPage.tsx
        │
        └── context/
            └── AuthContext.tsx
```

### PORT TABLE

| Service | Container Port | Host Port | Description |
|---------|----------------|-----------|-------------|
| backend | 3000 | 23001 | NestJS API server |
| frontend | 80 | 23002 | React SPA served via Nginx |
| postgres | 5432 | 25432 | PostgreSQL database |

### SHARED MODULES

This project does not require shared modules across multiple backend services. The architecture uses a single monolithic NestJS backend with feature modules (auth, usuario, tarea).

---

## 5. ENVIRONMENT VARIABLES

### Backend (.env)

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `NODE_ENV` | string | Environment mode | `development` |
| `PORT` | number | Server port | `3000` |
| `DB_HOST` | string | PostgreSQL host | `postgres` |
| `DB_PORT` | number | PostgreSQL port | `5432` |
| `DB_USERNAME` | string | Database username | `postgres` |
| `DB_PASSWORD` | string | Database password | `postgres123` |
| `DB_DATABASE` | string | Database name | `gestor_tareas` |
| `JWT_SECRET` | string | JWT signing secret (min 32 chars) | `your-super-secret-jwt-key-at-least-32-chars` |
| `JWT_EXPIRES_IN` | string | Token expiration time | `7d` |

### Frontend (.env)

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `VITE_API_URL` | string | Backend API base URL | `http://localhost:23001` |

---

## 6. IMPORT CONTRACTS

### Backend

```typescript
// main.ts imports
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// app.module.ts imports
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TareaModule } from './tarea/tarea.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// auth.module.ts exports
export { AuthModule } from './auth/auth.module';
// auth.controller.ts
export class AuthController { constructor(private authService: AuthService) {} }
// auth.service.ts
export class AuthService { login(), register() }

// usuario.module.ts exports
export { UsuarioModule } from './usuario/usuario.module';
// usuario.entity.ts
export class Usuario { id, nombre, email, password_hash, rol, activo, fecha_creacion, fecha_actualizacion }

// tarea.module.ts exports
export { TareaModule } from './tarea/tarea.module';
// tarea.entity.ts
export class Tarea { id, usuario_id, titulo, descripcion, prioridad, fecha_limite, estado, fecha_creacion, fecha_actualizacion }
export type PrioridadTarea = 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en curso' | 'terminada';
```

### Frontend

```typescript
// src/main.tsx imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// src/App.tsx imports
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyTasksPage from './pages/MyTasksPage';
import OverdueTasksPage from './pages/OverdueTasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import UserManagementPage from './pages/UserManagementPage';

// src/types/models.ts exports
export interface Usuario { id, nombre, email, rol, activo, ... }
export interface Tarea { id, usuario_id, titulo, descripcion, prioridad, fecha_limite, estado, ... }
export type PrioridadTarea = 'alta' | 'media' | 'baja';
export type EstadoTarea = 'pendiente' | 'en curso' | 'terminada';

// src/styles/tokens.ts exports
export const tokens = { colors, typography, spacing, radii, shadows, ... }

// src/services/api.ts exports
export const api = axiosInstance;

// src/services/auth.service.ts exports
export const authService = { login(), register(), logout() };

// src/services/tarea.service.ts exports
export const tareaService = { getTareas(), getTareasVencidas(), getDashboard(), createTarea(), updateTarea(), deleteTarea() };

// src/services/usuario.service.ts exports
export const usuarioService = { getUsuarios(), updateRol(), deactivateUser(), getPerfil() };

// src/hooks/useAuth.ts exports
export const useAuth = () => { usuario, login, register, logout, isAuthenticated, isLoading };

// src/hooks/useTareas.ts exports
export const useTareas = () => { tareas, loading, error, fetchTareas, createTarea, updateTarea, deleteTarea };

// src/hooks/useUsuarios.ts exports
export const useUsuarios = () => { usuarios, loading, error, fetchUsuarios, updateRol, deactivateUser };
```

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### 7.1 React Hooks

#### useAuth
```typescript
const useAuth = () => {
  usuario: Usuario | null;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};
```

#### useTareas
```typescript
const useTareas = (filtros?: { estado?: EstadoTarea; prioridad?: PrioridadTarea }) => {
  tareas: Tarea[];
  loading: boolean;
  error: string | null;
  fetchTareas: () => Promise<void>;
  createTarea: (data: TareaCreatePayload) => Promise<Tarea>;
  updateTarea: (id: string, data: TareaUpdatePayload) => Promise<Tarea>;
  deleteTarea: (id: string) => Promise<void>;
};
```

#### useUsuarios
```typescript
const useUsuarios = () => {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<void>;
  updateRol: (id: string, rol: 'admin' | 'member') => Promise<void>;
  deactivateUser: (id: string) => Promise<void>;
};
```

### 7.2 Component Props Interfaces

#### Navigation
```typescript
interface NavigationProps {
  activeKey: string;
  isAdmin: boolean;
  userName: string;
  userInitials: string;
  onNavigate: (key: string) => void;
}
```

#### Button
```typescript
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

#### TaskCard
```typescript
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    assignee: string;
    dueDate: string;
    priority: 'alta' | 'media' | 'baja';
    status: 'pendiente' | 'en curso' | 'terminada';
    isOverdue: boolean;
  };
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
}
```

#### Card
```typescript
interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  elevation?: 'subtle' | 'card' | 'sticky';
  className?: string;
}
```

#### PriorityBadge
```typescript
interface PriorityBadgeProps {
  priority: 'alta' | 'media' | 'baja';
  size?: 'sm' | 'md';
}
```

#### StatusBadge
```typescript
interface StatusBadgeProps {
  status: 'pendiente' | 'en curso' | 'terminada';
  size?: 'sm' | 'md';
}
```

#### FormField
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}
```

#### Select
```typescript
interface SelectProps {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}
```

#### UserTable
```typescript
interface UserTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    active: boolean;
  }>;
  onDeactivate: (id: string) => void;
  onRoleChange: (id: string, role: string) => void;
}
```

#### EmptyState
```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

---

## 8. FILE EXTENSION CONVENTION

| Category | Extension | Notes |
|----------|-----------|-------|
| Frontend Files | `.tsx` | All React components use TSX for JSX support |
| Frontend Type Files | `.ts` | Non-component TypeScript files |
| Entry Point | `/src/main.tsx` | TypeScript React project |
| Backend Files | `.ts` | NestJS TypeScript files |
| Configuration | `.json`, `.yml` | Package configs and Docker Compose |

**Project Language:** TypeScript (both frontend and backend)

**Entry Point Path:** `/src/main.tsx` (frontend), referenced in `index.html` as `<script type="module" src="/src/main.tsx"></script>`

---

## 9. DESIGN TOKENS

```typescript
// frontend/src/styles/tokens.ts
export const tokens = {
  colors: {
    primary: {
      base: '#2563EB',
      hover: '#1D4ED8',
      active: '#1E40AF',
      subtle: '#EFF6FF',
      border: '#BFDBFE',
    },
    neutrals: {
      canvas: '#F8FAFC',
      surface: '#FFFFFF',
      surface_muted: '#F1F5F9',
      surface_strong: '#E2E8F0',
      border: '#E2E8F0',
      border_strong: '#CBD5E1',
      text_primary: '#0F172A',
      text_secondary: '#475569',
      text_tertiary: '#64748B',
      text_disabled: '#94A3B8',
      white: '#FFFFFF',
    },
    semantic: {
      success: '#059669',
      success_bg: '#ECFDF5',
      success_border: '#A7F3D0',
      warning: '#D97706',
      warning_bg: '#FFF7ED',
      warning_border: '#FED7AA',
      danger: '#DC2626',
      danger_bg: '#FEF2F2',
      danger_border: '#FECACA',
      info: '#2563EB',
      info_bg: '#EFF6FF',
      info_border: '#BFDBFE',
      overdue: '#B91C1C',
    },
    status: {
      pending: '#64748B',
      pending_bg: '#F1F5F9',
      in_progress: '#2563EB',
      in_progress_bg: '#EFF6FF',
      done: '#059669',
      done_bg: '#ECFDF5',
    },
    priority: {
      high: '#DC2626',
      high_bg: '#FEF2F2',
      medium: '#D97706',
      medium_bg: '#FFF7ED',
      low: '#64748B',
      low_bg: '#F1F5F9',
    },
  },
  typography: {
    font_family: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    sizes: {
      display: {
        size: '28px',
        line_height: 36,
        weight: 700,
        letter_spacing: '-0.02em',
      },
      h1: {
        size: '22px',
        line_height: 30,
        weight: 700,
        letter_spacing: '-0.01em',
      },
      h2: {
        size: '18px',
        line_height: 26,
        weight: 600,
      },
      body: {
        size: '14px',
        line_height: 20,
        weight: 400,
      },
      body_medium: {
        size: '14px',
        line_height: 20,
        weight: 500,
      },
      small: {
        size: '12px',
        line_height: 16,
        weight: 400,
      },
      caption: {
        size: '11px',
        line_height: 14,
        weight: 500,
        letter_spacing: '0.02em',
      },
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '48px',
    page_padding_desktop: '32px',
    page_padding_mobile: '16px',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    pill: '999px',
  },
  shadows: {
    subtle: '0px 1px 2px rgba(15, 23, 42, 0.05)',
    card: '0px 1px 3px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.04)',
    sticky: '0px 4px 12px rgba(15, 23, 42, 0.08)',
    overlay: '0px 16px 40px rgba(15, 23, 42, 0.16)',
  },
  icon_image_style: {
    style: "Iconografía lineal con trazo de 1.5px, esquinas redondeadas y tamaño base de 20px sobre rejilla de 24px. Estilo consistente con Lucide o Feather.",
    avatar: "Avatares circulares con iniciales, fondo neutro y texto secundario; sin fotografías en la fase inicial.",
    empty_states: "Ilustraciones simples en gris claro con acento primario sutil, evitando ornamentación excesiva.",
  },
  motion_interaction: {
    duration_fast: '120ms ease-out',
    duration_base: '180ms ease-in-out',
    duration_modal: '220ms ease-out',
    hover: 'Cambio de color y elevación sutil de 1px en elementos interactivos.',
    focus_ring: 'Anillo visible de 3px con color primario al 25% de opacidad en todos los controles.',
    reduced_motion: 'Respetar prefers-reduced-motion desactivando transiciones no esenciales.',
  },
  accessibility: {
    contrast: 'Texto principal sobre superficie blanca con contraste mínimo AA/AAA; los estados y prioridades incluyen ícono/texto además de color.',
    touch_targets: 'Botones y controles interactivos con área mínima de 40x40px.',
    form_labels: 'Etiquetas siempre visibles y mensajes de error descriptivos asociados por aria-describedby.',
  },
  layout: {
    sidebar_width: '248px',
    content_max_width: '1240px',
    card_gap: '16px',
    metric_card_min_height: '128px',
    table_min_width_desktop: '760px',
  },
};
```

---

## 10. FUNCTIONAL REQUIREMENTS COVERAGE

| Requirement | Implementation | Files |
|---|---|---|
| User registration with name, email, password | POST /auth/register endpoint validates input, hashes password with bcrypt, creates Usuario record with rol='member' | backend/src/auth/auth.controller.ts, auth.service.ts, usuario.entity.ts |
| User login with email/password, JWT token issuance | POST /auth/login validates credentials, returns JWT access_token with 7-day expiry | backend/src/auth/auth.controller.ts, auth.service.ts, jwt.strategy.ts |
| JWT authentication guard for protected routes | JwtAuthGuard applied to all /tareas and /usuarios endpoints | backend/src/auth/jwt-auth.guard.ts, auth.module.ts |
| Create task with title, description, priority, deadline | POST /tareas creates Tarea with estado='pendiente', validates priority enum and date format | backend/src/tarea/tarea.controller.ts, tarea.service.ts, create-tarea.dto.ts |
| View own tasks with filters by status and priority | GET /tareas accepts optional query params, returns filtered tareas for authenticated user | backend/src/tarea/tarea.controller.ts, tarea.service.ts |
| Update task status (pendiente → en curso → terminada) | PATCH /tareas/:id updates estado field, validates transition | backend/src/tarea/tarea.controller.ts, tarea.service.ts, update-tarea.dto.ts |
| View all overdue tasks for team | GET /tareas/vencidas returns all tasks where fecha_limite < now AND estado != 'terminada' | backend/src/tarea/tarea.controller.ts, tarea.service.ts |
| View dashboard with summary metrics | GET /tareas/dashboard returns counts (pendientes, en_curso, terminadas, vencidas) and recent overdue/proximate tasks | backend/src/tarea/tarea.controller.ts, tarea.service.ts |
| User management page for admins | GET /usuarios, PATCH /usuarios/:id/rol, PATCH /usuarios/:id/desactivar endpoints | backend/src/usuario/usuario.controller.ts, usuario.service.ts |
| Role-based access control (admin vs member) | RolesGuard checks usuario.rol for admin-only endpoints | backend/src/common/guards/roles.guard.ts |
| Priority badge (alta=red, media=amber, baja=gray) | PriorityBadge component renders colors from tokens.status.priority | frontend/src/components/ui/PriorityBadge.tsx |
| Status badge (pendiente, en curso, terminada) | StatusBadge component renders colors from tokens.colors.status | frontend/src/components/ui/StatusBadge.tsx |
| Overdue indicator (red background when task past deadline) | TaskCard calculates isOverdue from fecha_limite vs current date | frontend/src/components/ui/TaskCard.tsx |
| Login page with email/password form | LoginPage.tsx with FormField components, form validation | frontend/src/pages/LoginPage.tsx |
| Register page with name, email, password form | RegisterPage.tsx with FormField components, password requirements display | frontend/src/pages/RegisterPage.tsx |
| Dashboard page with metrics cards and overdue alerts | DashboardPage.tsx shows metric cards, overdue tasks list, upcoming tasks | frontend/src/pages/DashboardPage.tsx |
| My tasks page with filter dropdowns and task list | MyTasksPage.tsx with Select components for filters, TaskCard list | frontend/src/pages/MyTasksPage.tsx |
| Overdue tasks page showing team overdue tasks | OverdueTasksPage.tsx with EmptyState when no overdue tasks | frontend/src/pages/OverdueTasksPage.tsx |
| Create task page with form fields and priority selector | CreateTaskPage.tsx with FormField, Select for priority, date input | frontend/src/pages/CreateTaskPage.tsx |
| User management page with user table | UserManagementPage.tsx with UserTable component, role/deactivate actions | frontend/src/pages/UserManagementPage.tsx |
| Navigation sidebar with user info and admin links | Navigation.tsx component shows userName, userInitials, conditional admin menu items | frontend/src/components/ui/Navigation.tsx |
| JWT token storage and auto-refresh on page reload | AuthContext.tsx stores token in localStorage, checks auth on mount | frontend/src/context/AuthContext.tsx, useAuth hook |
| Design tokens from Figma applied to all components | All components import tokens from styles/tokens.ts | frontend/src/styles/tokens.ts, all component files |
| PostgreSQL database with USUARIO and TAREA tables | TypeORM entities map to ERD schema exactly | backend/src/usuario/usuario.entity.ts, tarea.entity.ts |
| Docker Compose orchestration for local development | docker-compose.yml defines backend, frontend, postgres services | docker-compose.yml |
| Containerization with Dockerfiles | backend/Dockerfile and frontend/Dockerfile with multi-stage builds | backend/Dockerfile, frontend/Dockerfile |
| Protected API endpoints require valid JWT | JwtAuthGuard returns 401 for missing/invalid tokens | backend/src/auth/jwt-auth.guard.ts |
| Admin-only endpoints return 403 for non-admin users | RolesGuard checks role, returns 403 Forbidden | backend/src/common/guards/roles.guard.ts |
| Password hashing with bcrypt (min 10 rounds) | usuario.service.ts hashes password on create with bcrypt | backend/src/usuario/usuario.service.ts |
| Input validation with class-validator decorators | All DTOs use @IsEmail, @IsString, @IsEnum, @IsDateString | backend/src/auth/dto/*.ts, tarea/dto/*.ts |
| CORS configuration for frontend-backend communication | NestJS CORS enabled for VITE_API_URL origin | backend/src/main.ts |
| Responsive layout with sidebar navigation | Frontend uses layout tokens (sidebar_width, page_padding_mobile) | frontend/src/App.tsx, Navigation.tsx |
| Error handling with descriptive messages | API returns { message, statusCode } on errors | backend/src/*/*.controller.ts |
| Task deletion with confirmation | TaskCard onDelete triggers confirmation before API call | frontend/src/components/ui/TaskCard.tsx, pages |
| User deactivation (soft delete) | PATCH /usuarios/:id/desactivar sets activo=false | backend/src/usuario/usuario.controller.ts, usuario.service.ts |
| User initials avatar from name | Navigation.tsx calculates userInitials from userName | frontend/src/components/ui/Navigation.tsx |

---

## 11. DATABASE SCHEMA (PostgreSQL via TypeORM)

### USUARIO Table
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Primary key |
| nombre | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| rol | VARCHAR(50) | NOT NULL, DEFAULT 'member' | 'admin' or 'member' |
| activo | BOOLEAN | NOT NULL, DEFAULT true | Account active status |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| fecha_actualizacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

### TAREA Table
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | Primary key |
| usuario_id | UUID | FK → USUARIO.id, NOT NULL | Task owner |
| titulo | VARCHAR(255) | NOT NULL | Task title |
| descripcion | TEXT | NULLABLE | Task description |
| prioridad | VARCHAR(50) | NOT NULL | 'alta', 'media', 'baja' |
| fecha_limite | DATE | NOT NULL | Due date |
| estado | VARCHAR(50) | NOT NULL, DEFAULT 'pendiente' | 'pendiente', 'en curso', 'terminada' |
| fecha_creacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| fecha_actualizacion | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

---

## 12. SECURITY REQUIREMENTS

| Requirement | Implementation |
|---|---|
| Password hashing | bcrypt with minimum 10 salt rounds |
| JWT token security | HS256 algorithm, 7-day expiration, minimum 32-character secret |
| SQL injection prevention | TypeORM parameterized queries |
| Input validation | class-validator on all DTOs |
| Role-based access | RolesGuard for admin endpoints (/usuarios) |
| CORS | Restricted to frontend origin only |
| Password requirements | Minimum 6 characters (validated in register DTO) |
| Auth guard on all task endpoints | JwtAuthGuard applied to TareaController |