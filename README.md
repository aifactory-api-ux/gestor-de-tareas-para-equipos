# Gestor de Tareas para Equipos

Aplicación web para gestionar tareas de un equipo pequeño. Permite a cada persona crear y ver sus tareas con prioridad y fecha límite, y al equipo ver las tareas vencidas.

## Requisitos

- Docker 20.10+
- Docker Compose 2.0+

## Inicio Rápido

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd gestor-tareas
   ```

2. **Iniciar la aplicación**
   ```bash
   ./run.sh
   ```

   El script automáticamente:
   - Verifica que Docker esté instalado
   - Crea el archivo `.env` desde `.env.example` si no existe
   - Construye las imágenes de Docker
   - Inicia todos los servicios
   - Espera a que todos los servicios estén saludables

3. **Acceder a la aplicación**
   - Frontend: http://localhost:23002
   - Backend API: http://localhost:3000

## Estructura del Proyecto

```
gestor-tareas/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Módulo de autenticación (JWT)
│   │   ├── usuario/     # Módulo de usuarios
│   │   └── tarea/       # Módulo de tareas
│   ├── Dockerfile
│   └── package.json
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes UI
│   │   ├── pages/       # Páginas de la aplicación
│   │   ├── hooks/      # Custom hooks
│   │   └── context/     # Contextos de React
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml    # Orquestación de servicios
├── run.sh               # Script de inicio
├── .env.example         # Variables de entorno (plantilla)
└── README.md
```

## Variables de Entorno

El archivo `.env.example` contiene todas las variables necesarias:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DB_USERNAME` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `postgres` |
| `DB_DATABASE` | Nombre de la base de datos | `gestor_tareas` |
| `DB_PORT` | Puerto externo de PostgreSQL | `25432` |
| `BACKEND_PORT` | Puerto del backend | `3000` |
| `JWT_SECRET` | Secreto para JWT (mín. 32 chars) | (valor largo por defecto) |
| `FRONTEND_PORT` | Puerto del frontend | `23002` |

## Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Iniciar sesión |

### Tareas (requieren JWT)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tareas` | Listar tareas del usuario |
| GET | `/tareas/vencidas` | Listar tareas vencidas del equipo |
| GET | `/tareas/dashboard` | Obtener resumen de tareas |
| POST | `/tareas` | Crear tarea |
| PATCH | `/tareas/:id` | Actualizar tarea |
| DELETE | `/tareas/:id` | Eliminar tarea |

### Usuarios (requieren JWT + rol admin)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios` | Listar usuarios |
| PATCH | `/usuarios/:id/rol` | Actualizar rol |
| PATCH | `/usuarios/:id/desactivar` | Desactivar usuario |

## Comandos Docker Compose

```bash
# Iniciar servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Reiniciar servicios
docker compose restart

# Rebuild sin cache
docker compose build --no-cache

# Ver estado de servicios
docker compose ps
```

## Gestión de Datos

### Persistencia

Los datos de PostgreSQL se almacenan en un volumen Docker llamado `gestor_tareas_postgres_data`. Los datos persisten entre reinicios.

### Reset de Datos

Para eliminar todos los datos y empezar desde cero:

```bash
docker compose down -v
docker compose up -d
```

## Seguridad

- Contraseñas almacenadas con bcrypt (10 rondas)
- Tokens JWT con expiración de 7 días
- Endpoints de administración protegidos por rol
- Validación de entrada en todos los endpoints

## Desarrollo

###Backend

```bash
cd backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Licencia

Privado - Uso interno
