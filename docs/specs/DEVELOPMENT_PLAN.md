# DEVELOPMENT PLAN: Gestor de Tareas para Equipos

## 1. ARCHITECTURE OVERVIEW

### Components
```
gestor-tareas/
├── frontend/          → React 18 SPA con Vite
├── backend/           → NestJS API con TypeORM
├── postgres/          → PostgreSQL 15 (via Docker)
└── docker-compose.yml → Orquestación de servicios
```

### Data Models
- **Usuario**: id, nombre, email, password_hash, rol (admin|member), activo, fecha_creacion, fecha_actualizacion
- **Tarea**: id, usuario_id, titulo, descripcion, prioridad (alta|media|baja), fecha_limite, estado (pendiente|en curso|terminada), fecha_creacion, fecha_actualizacion

### API Endpoints
- **Auth**: POST /auth/login, POST /auth/register
- **Tareas**: GET/POST /tareas, GET /tareas/vencidas, GET /tareas/dashboard, GET/PATCH/DELETE /tareas/:id
- **Usuarios**: GET /usuarios, PATCH /usuarios/:id/rol, PATCH /usuarios/:id/desactivar, GET /usuarios/perfil

### Ports
| Service | Container | Host |
|---------|-----------|------|
| backend | 3000 | 23001 |
| frontend | 80 | 23002 |
| postgres | 5432 | 25432 |

---

## 2. ACCEPTANCE CRITERIA

1. TC001: Verificar registro exitoso de un nuevo usuario con datos válidos → El usuario es registrado exitosamente y redirigido a la página de inicio/tareas.
2. TC002: Verificar la creación exitosa de una tarea con todos los campos obligatorios y válidos → La tarea se crea exitosamente y aparece en el listado de tareas del usuario con la prioridad y fecha límite especificadas.
3. TC003: Verificar que no se puede crear una tarea sin la descripción obligatoria → Se muestra un mensaje de error indicando que la descripción es obligatoria y la tarea no se crea.
4. TC004: Verificar que el usuario puede ver sus tareas ordenadas por prioridad y fecha límite → Se muestra un listado de todas las tareas asignadas al usuario, ordenadas primero por prioridad (Alta, Media, Baja) y luego por fecha límite (más cercana primero).
5. TC005: Verificar la visualización de tareas vencidas del equipo, excluyendo las completadas → Se muestra un listado de todas las tareas vencidas de todo el equipo. Las tareas que han sido marcadas como 'terminadas' no deben aparecer en este listado.
6. TC006: Verificar el resumen del estado de tareas (pendientes, en curso, terminadas) y su actualización → Se muestra un resumen con los conteos correctos de tareas pendientes, en curso y terminadas. El resumen se actualiza inmediatamente después de cambiar el estado de una tarea.
7. TC007: Verificar el inicio de sesión exitoso con credenciales válidas → El usuario inicia sesión exitosamente y es redirigido a su panel de tareas.
8. TC008: Verificar que un administrador puede acceder y ver el listado de usuarios → El administrador accede a la sección y se muestra un listado completo de todos los usuarios registrados en el sistema.
9. TC009: Verificar que no se puede crear una tarea con una fecha límite pasada → Se muestra un mensaje de error indicando que la fecha límite debe ser futura y la tarea no se crea.
10. TC010: Verificar que el inicio de sesión falla con credenciales inválidas → Se muestra un mensaje de error indicando credenciales inválidas y el usuario no puede iniciar sesión.
11. TC011: Verificar que las solicitudes autenticadas funcionan correctamente después del login JWT → La funcionalidad se carga correctamente, indicando que el token JWT fue validado y el usuario está autenticado para realizar acciones.
12. TC012: Verificar que el listado de tareas vencidas del equipo está vacío si no hay tareas vencidas → Se muestra un mensaje indicando que no hay tareas vencidas o un listado vacío.
13. TC013: Verificar que una tarea con fecha límite pasada aparece inmediatamente en el listado de vencidas → La tarea recién creada con fecha límite pasada aparece en el listado de 'Tareas Vencidas del Equipo'.
14. TC014: Verificar que no se puede crear una tarea sin título → Se muestra un mensaje de error indicando que el título es obligatorio y la tarea no se crea.
15. TC015: Verificar que el registro falla si el correo electrónico ya está en uso → Se muestra un mensaje de error indicando que el correo electrónico ya está registrado y el usuario no se crea.
16. TC016: Verificar el tiempo de carga de la lista de tareas de un usuario → La lista de tareas del usuario se carga y se muestra completamente en menos de 2 segundos.
17. TC017: Verificar el tiempo de carga de la lista de tareas vencidas para el equipo → La lista de tareas vencidas del equipo se carga y se muestra completamente en menos de 3 segundos.
18. TC018: Comprobar que el sistema rechaza el inicio de sesión con credenciales incorrectas → El sistema muestra un mensaje de error claro indicando credenciales inválidas y no permite el acceso al usuario.
19. TC019: Verificar que un usuario no puede acceder a las tareas individuales de otro usuario → El sistema deniega el acceso a la tarea del Usuario B y/o muestra un error de autorización.
20. TC020: Evaluar el comportamiento del sistema bajo creación simultánea de tareas por múltiples usuarios → Todas las tareas se crean exitosamente sin errores, conflictos de datos o degradación significativa del rendimiento.
21. TC021: Verificar que la sesión del usuario expira según la configuración del token JWT → El sistema solicita al usuario volver a iniciar sesión o lo redirige automáticamente a la página de login.
22. TC022: Asegurar que la aplicación se inicia correctamente y es accesible localmente usando Docker Compose → La aplicación web es accesible en el navegador y muestra la página de inicio de sesión/registro sin errores.
23. TC023: Verificar que el resumen de estado de tareas se actualiza rápidamente tras una acción → El contador de tareas 'Pendientes' se actualiza inmediatamente (en menos de 1 segundo) después de la creación exitosa de la tarea.
24. NFR001: Verificar que solo administradores pueden acceder a la gestión de usuarios → El sistema deniega el acceso al usuario normal con un error de autorización (403 Forbidden).
25. NFR002: Comprobar que el sistema rechaza solicitudes con un token JWT modificado o inválido → El sistema rechaza la solicitud con un error 401 Unauthorized o 403 Forbidden.
26. NFR003: Medir el tiempo de respuesta del backend al crear una tarea → La tarea se crea exitosamente y la confirmación visual se muestra en la interfaz en menos de 1 segundo.
27. NFR004: Verificar que los datos de las tareas persisten después de un reinicio del contenedor de la base de datos → Todas las tareas creadas antes del reinicio están presentes y consistentes.
28. NFR005: Evaluar la capacidad del sistema para manejar múltiples inicios de sesión concurrentes → Todos los intentos son exitosos con tiempo de respuesta inferior a 1.5 segundos.
29. NFR006: Verificar que las contraseñas de usuario se almacenan hasheadas en la base de datos → El campo contiene un valor hasheado (ej. "$2a$10$...").
30. NFR007: Comprobar la robustez del backend ante datos malformados o inválidos → El backend rechaza con 400 Bad Request y mensaje descriptivo.

---

## 3. EXECUTABLE ITEMS

### ITEM 1: Foundation — Base de datos, tipos compartidos y configuración
**Goal:** Crear el esquema de base de datos PostgreSQL, tipos TypeScript compartidos, tokens de diseño y configuración del proyecto.
**Files to create:**
- backend/src/usuario/entities/usuario.entity.ts (create) - Entidad Usuario con TypeORM: id, nombre, email, password_hash, rol, activo, fecha_creacion, fecha_actualizacion
- backend/src/tarea/entities/tarea.entity.ts (create) - Entidad Tarea con TypeORM: id, usuario_id, titulo, descripcion, prioridad, fecha_limite, estado, fecha_creacion, fecha_actualizacion. Incluye tipos PrioridadTarea y EstadoTarea
- frontend/src/types/models.ts (create) - Interfaces TypeScript: Usuario, Tarea, TareaCreatePayload, TareaUpdatePayload, LoginPayload, RegisterPayload, AuthResponse, ApiError. Tipos: PrioridadTarea, EstadoTarea
- frontend/src/styles/tokens.ts (create) - Design tokens verbatim del contrato UI/UX: colors, typography, spacing, radii, shadows, motion_interaction, accessibility, layout
- backend/src/main.ts (create) - Punto de entrada NestJS con ValidationPipe, CORS, y conexión TypeORM
- backend/src/app.module.ts (create) - Módulo raíz con TypeOrmModule, AuthModule, UsuarioModule, TareaModule
- backend/tsconfig.json (create) - Configuración TypeScript con experimentalDecorators, strictNullChecks
- backend/nest-cli.json (create) - Configuración NestJS CLI
- backend/package.json (create) - Dependencias: @nestjs/core, @nestjs/typeorm, @nestjs/jwt, @nestjs/passport, passport, passport-jwt, bcrypt, class-validator, pg, typescript
- frontend/tsconfig.json (create) - Configuración TypeScript para Vite/React
- frontend/vite.config.ts (create) - Configuración Vite con proxy hacia backend
- frontend/package.json (create) - Dependencias: react, react-dom, react-router-dom, axios, vite, tailwindcss, @types/react, @types/react-dom
- frontend/index.html (create) - HTML entry point con script /src/main.tsx
**Dependencies:** Ninguna
**Validation:** El esquema TypeORM compila sin errores y las interfaces TypeScript son consistentes entre frontend y backend
**Role:** role-tl (technical_lead)

---

### ITEM 2: Backend — Módulo de Autenticación (Auth, JWT, Login, Register)
**Goal:** Implementar el módulo de autenticación con login, registro de usuarios y estrategia JWT.
**Files to create:**
- backend/src/auth/auth.module.ts (create) - Módulo NestJS exportando AuthModule con JwtModule, PassportModule, TypeOrmModule
- backend/src/auth/auth.controller.ts (create) - Controlador con POST /auth/login y POST /auth/register, usando ValidationPipe
- backend/src/auth/auth.service.ts (create) - Servicio con métodos login() y register(), usa bcrypt para hash de contraseñas y JWT
- backend/src/auth/jwt.strategy.ts (create) - PassportStrategy con JWT extraction del header Authorization: Bearer
- backend/src/auth/jwt-auth.guard.ts (create) - Guard que protege endpoints con JwtAuthGuard
- backend/src/auth/dto/login.dto.ts (create) - DTO con @IsEmail, @IsString para email y password
- backend/src/auth/dto/register.dto.ts (create) - DTO con @IsString, @IsEmail, @MinLength(6) para nombre, email, password
- backend/Dockerfile (create) - Multi-stage build con node:20-alpine, compila TypeScript, usuario no-root, EXPOSE 3000, CMD con node dist/main.js
**Dependencies:** Item 1
**Validation:** `docker build -t gestor-backend ./backend && docker run --rm --env-file .env.example gestor-backend` inicia sin errores de compilación
**Role:** role-be (backend_developer)

---

### ITEM 3: Backend — Módulo de Usuarios (CRUD, Perfil, Gestión de roles)
**Goal:** Implementar el módulo de gestión de usuarios con perfil, listado, cambio de rol y desactivación.
**Files to create:**
- backend/src/usuario/usuario.module.ts (create) - Módulo NestJS con TypeOrmModule.forFeature([Usuario])
- backend/src/usuario/usuario.controller.ts (create) - Controlador con GET /usuarios (admin), PATCH /usuarios/:id/rol (admin), PATCH /usuarios/:id/desactivar (admin), GET /usuarios/perfil
- backend/src/usuario/usuario.service.ts (create) - Servicio con métodos CRUD, hash de contraseña con bcrypt (10 rondas), búsqueda por email único
- backend/src/usuario/dto/update-rol.dto.ts (create) - DTO con @IsEnum para rol (admin|member)
- backend/src/usuario/dto/usuario-response.dto.ts (create) - DTO de respuesta sin password_hash
- backend/src/common/decorators/current-user.decorator.ts (create) - Decorador @CurrentUser() para obtener usuario del request
- backend/src/common/guards/roles.guard.ts (create) - Guard RolesGuard que verifica rol admin enEndpoints protegidos
**Dependencies:** Item 1, Item 2
**Validation:** El endpoint GET /usuarios requiere JWT válido con rol admin (403 para miembros)
**Role:** role-be (backend_developer)

---

### ITEM 4: Backend — Módulo de Tareas (CRUD, Vencidas, Dashboard)
**Goal:** Implementar el módulo de tareas con creación, listado, actualización de estado, tareas vencidas y dashboard.
**Files to create:**
- backend/src/tarea/tarea.module.ts (create) - Módulo NestJS con TypeOrmModule.forFeature([Tarea, Usuario])
- backend/src/tarea/tarea.controller.ts (create) - Controlador con GET /tareas (propio usuario), GET /tareas/vencidas (todos), GET /tareas/dashboard (resumen), POST /tareas, GET /tareas/:id, PATCH /tareas/:id, DELETE /tareas/:id. Todos protegidos por JwtAuthGuard
- backend/src/tarea/tarea.service.ts (create) - Servicio con lógica de negocio: ordenamiento por prioridad (alta>media>baja) y fecha_limite, filtrado de vencidas (fecha_limite < ahora AND estado != terminada), cálculo de métricas dashboard
- backend/src/tarea/dto/create-tarea.dto.ts (create) - DTO con @IsString, @IsOptional, @IsEnum, @IsDateString. Valida que fecha_limite no sea pasada
- backend/src/tarea/dto/update-tarea.dto.ts (create) - DTO parcial con campos opcionales para actualización
- backend/src/tarea/dto/tarea-response.dto.ts (create) - DTO de respuesta con campo isOverdue calculado
**Dependencies:** Item 1, Item 2
**Validation:** GET /tareas/vencidas excluye tareas con estado='terminada' y muestra nombre_usuario del propietario
**Role:** role-be (backend_developer)

---

### ITEM 5: Frontend — Autenticación (Login, Register) y Contexto de Auth
**Goal:** Implementar páginas de Login y Register con validación de formularios y AuthContext para gestión de estado de autenticación.
**Files to create:**
- frontend/src/context/AuthContext.tsx (create) - Context con usuario, login, register, logout, isAuthenticated, isLoading. Almacena JWT en localStorage
- frontend/src/services/api.ts (create) - Instancia Axios con interceptor para agregar Authorization header con JWT
- frontend/src/services/auth.service.ts (create) - Funciones login() y register() que llaman a POST /auth/login y POST /auth/register
- frontend/src/hooks/useAuth.ts (create) - Hook que usa AuthContext: retorna usuario, login, register, logout, isAuthenticated, isLoading
- frontend/src/pages/LoginPage.tsx (create) - Página de login con email y password, validación, mensaje de error, redirección a /dashboard tras login exitoso
- frontend/src/pages/RegisterPage.tsx (create) - Página de registro con nombre, email, password, validación, mensaje de error, redirección a /dashboard tras registro exitoso
- frontend/src/components/ui/FormField.tsx (create) - Componente reutilizable para inputs de formulario con label, error, required
- frontend/src/components/ui/Button.tsx (create) - Componente Button con variants (primary, secondary, ghost, danger), sizes (sm, md, lg), icon
- frontend/src/index.css (create) - Estilos base con Tailwind CSS, fuente Inter, variables CSS de tokens
**Dependencies:** Item 1
**Validation:** El usuario puede registrarse con email único y luego iniciar sesión exitosamente con esas credenciales
**Role:** role-fe (frontend_developer)

---

### ITEM 6: Frontend — Dashboard y Navegación
**Goal:** Implementar página de Dashboard con métricas y componente Navigation con sidebar.
**Files to create:**
- frontend/src/components/ui/Navigation.tsx (create) - Sidebar con userName, userInitials (del nombre), isAdmin para mostrar menú de administración, enlaces a todas las páginas
- frontend/src/components/ui/Card.tsx (create) - Componente Card con props children, padding, elevation
- frontend/src/components/ui/StatusBadge.tsx (create) - Badge con colores según estado (pendiente|en curso|terminada)
- frontend/src/components/ui/PriorityBadge.tsx (create) - Badge con colores según prioridad (alta|media|baja)
- frontend/src/components/ui/EmptyState.tsx (create) - Componente para estados vacíos con title, description, actionLabel, onAction
- frontend/src/pages/DashboardPage.tsx (create) - Dashboard con métricas: total_tareas, pendientes, en_curso, terminadas, vencidas. Lista de vencidas recientes y próximas por vencer. Actualización inmediata tras cambios
- frontend/src/services/tarea.service.ts (create) - Funciones: getTareas(), getTareasVencidas(), getDashboard(), createTarea(), updateTarea(), deleteTarea()
- frontend/src/hooks/useTareas.ts (create) - Hook con tareas, loading, error, fetchTareas, createTarea, updateTarea, deleteTarea
- frontend/src/App.tsx (create) - Router principal con Routes para todas las páginas, AuthProvider, protección de rutas autenticadas, Navigation
**Dependencies:** Item 1, Item 5
**Validation:** Dashboard muestra conteos correctos y se actualiza en menos de 1 segundo tras crear tarea
**Role:** role-fe (frontend_developer)

---

### ITEM 7: Frontend — Gestión de Tareas (Mis Tareas, Crear Tarea, Tareas Vencidas)
**Goal:** Implementar páginas de listado de tareas propias, creación de tareas y visualización de tareas vencidas del equipo.
**Files to create:**
- frontend/src/components/ui/TaskCard.tsx (create) - Tarjeta de tarea con título, descripción, prioridad, fecha límite, estado, indicador isOverdue (fondo rojo si vencida), botones para cambiar estado y editar
- frontend/src/components/ui/Select.tsx (create) - Componente Select con label, options, value, onChange, error, placeholder
- frontend/src/components/ui/UserTable.tsx (create) - Tabla de usuarios con name, email, role, active, acciones de deactivate y role change
- frontend/src/pages/MyTasksPage.tsx (create) - Lista de tareas propias con Select para filtros de estado y prioridad. Ordenamiento: prioridad (Alta>Media>Baja) luego fecha_límite (más cercana primero)
- frontend/src/pages/CreateTaskPage.tsx (create) - Formulario de creación con título (requerido), descripción (opcional), prioridad (Select), fecha_límite (date input). Validación: título requerido, fecha límite no pasada
- frontend/src/pages/OverdueTasksPage.tsx (create) - Lista de tareas vencidas del equipo con EmptyState cuando no hay vencidas. Muestra nombre_usuario de cada tarea
- frontend/src/services/usuario.service.ts (create) - Funciones: getUsuarios(), updateRol(), deactivateUser(), getPerfil()
- frontend/src/hooks/useUsuarios.ts (create) - Hook con usuarios, loading, error, fetchUsuarios, updateRol, deactivateUser
**Dependencies:** Item 1, Item 5, Item 6
**Validation:** Crear tarea sin título muestra error "El título es obligatorio"; crear tarea con fecha pasada muestra error "La fecha límite debe ser futura"
**Role:** role-fe (frontend_developer)

---

### ITEM 8: Frontend — Gestión de Usuarios (Admin)
**Goal:** Implementar página de gestión de usuarios para administradores con listado, cambio de rol y desactivación.
**Files to create:**
- frontend/src/pages/UserManagementPage.tsx (create) - Página protegida (solo admin) con tabla de usuarios, botones para cambiar rol (admin<->member) y desactivar. Muestra mensaje 403 para usuarios no-admin
**Dependencies:** Item 1, Item 5, Item 6, Item 7
**Validation:** Usuario con rol 'member' recibe error 403 al intentar acceder a /usuarios
**Role:** role-fe (frontend_developer)

---

### ITEM 9: Frontend — Docker y Construcción
**Goal:** Crear Dockerfile para el frontend React con Vite, usando Nginx para servir la aplicación estática.
**Files to create:**
- frontend/Dockerfile (create) - Multi-stage build: node:20-alpine como builder con Vite, nginx:alpine para servir. ARG VITE_API_URL con valor http://localhost:23001. EXPOSE 80
- frontend/.env.example (create) - VITE_API_URL=http://localhost:23001
**Dependencies:** Item 1, Item 5, Item 6, Item 7, Item 8
**Validation:** `docker build -t gestor-frontend ./frontend` compila exitosamente con Vite
**Role:** role-fe (frontend_developer)

---

### ITEM 10: Infrastructure — Docker Compose y Documentación
**Goal:** Crear orquestación completa con Docker Compose, script de ejecución y documentación.
**Files to create:**
- docker-compose.yml (create) - Servicios: postgres (puerto 25432), backend (puerto 23001 con healthcheck), frontend (puerto 23002 con healthcheck). depends_on con condition: service_healthy. Variables de entorno desde .env
- .env.example (create) - Todas las variables: NODE_ENV, PORT, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, JWT_SECRET, JWT_EXPIRES_IN, VITE_API_URL con descripciones
- .gitignore (create) - Excluye: node_modules, dist, .env, __pycache__, *.pyc, .DS_Store
- .dockerignore (create) - Excluye: node_modules, .git, *.log, dist
- run.sh (create) - Script que verifica Docker, ejecuta docker-compose up --build, espera servicios healthy, imprime URLs de acceso
- README.md (create) - Documentación: Prerequisites | Clone | Run (./run.sh) | Test | Endpoints | Arquitectura
- backend/.env.example (create) - Variables específicas del backend para referencia
**Dependencies:** Item 2, Item 3, Item 4, Item 9
**Validation:** `./run.sh` levanta todos los servicios, la aplicación es accesible en http://localhost:23002 y muestra login/registro sin errores
**Role:** role-devops (devops_support)