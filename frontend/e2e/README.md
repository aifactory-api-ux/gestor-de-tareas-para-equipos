# E2E Tests - Gestor de Tareas para Equipos

Este directorio contiene las pruebas E2E (End-to-End) para la aplicación Gestor de Tareas para Equipos.

## Requisitos

- Docker Compose debe estar corriendo con la aplicación completa (backend, frontend, postgres)
- Los tests E2E requieren que los servicios estén accesibles en `http://localhost:23002` (o la URL configurada)

## Ejecutar las pruebas

### Prerrequisitos

1. Asegúrate de que los contenedores estén corriendo:

```bash
docker-compose up -d
```

2. Espera a que todos los servicios estén healthy.

### Ejecutar todas las pruebas

```bash
cd frontend
npm run test:e2e
```

### Ejecutar pruebas en modo UI (visual)

```bash
npm run test:e2e:ui
```

### Ejecutar pruebas en modo headed (con navegador visible)

```bash
npm run test:e2e:headed
```

### Variables de entorno

- `BASE_URL`: URL base de la aplicación (por defecto: `http://localhost:23002`)

## Estructura de los tests

- `auth.spec.ts` - Pruebas de autenticación (login, registro, validación)
- `tasks.spec.ts` - Pruebas de gestión de tareas (crear, listar, actualizar)
- `overdue-tasks.spec.ts` - Pruebas de tareas vencidas
- `dashboard.spec.ts` - Pruebas del dashboard
- `performance.spec.ts` - Pruebas de rendimiento (NFR)
- `admin-users.spec.ts` - Pruebas de gestión de usuarios (admin)

## Cobertura de pruebas

### Autenticación
- TC007: Inicio de sesión exitoso con credenciales válidas
- TC010: Inicio de sesión falla con credenciales inválidas
- TC001: Registro exitoso de un nuevo usuario
- TC015: Registro falla si el correo ya está en uso
- TC011: Solicitudes autenticadas funcionan con JWT

### Tareas
- TC002: Creación exitosa de tarea con campos obligatorios
- TC003: No se puede crear tarea sin descripción obligatoria
- TC009: No se puede crear tarea con fecha límite pasada
- TC014: No se puede crear tarea sin título
- TC004: Usuario ve sus tareas ordenadas por prioridad y fecha
- TC006: Resumen de estado de tareas y actualización

### Tareas Vencidas
- TC005: Visualización de tareas vencidas excluyendo completadas
- TC012: Listado vacío cuando no hay tareas vencidas
- TC013: Tarea con fecha pasada aparece inmediatamente en vencidas

### Dashboard
- Carga correcta de métricas
- Navegación entre páginas
- Alertas de tareas vencidas
- Tiempo de carga < 3 segundos

### Rendimiento (NFR)
- NFR001: Lista de tareas carga en < 2 segundos
- NFR002: Lista de vencidas carga en < 3 segundos
- NFR003: Creación de tarea responde en < 1 segundo
- NFR005: Login responde en < 1.5 segundos

### Admin
- TC008: Administrador puede ver listado de usuarios
- NFR001: Solo admin puede acceder a gestión de usuarios

## Notas

- Los tests usan datos únicos basados en timestamps para evitar conflictos
- Cada test crea sus propios usuarios y datos de prueba
- Los tests son independientes y pueden ejecutarse en cualquier orden
- No se usan mocks - todos los tests golpean el backend real via docker-compose