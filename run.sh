#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ============================================
# Gestor de Tareas para Equipos - Startup Script
# ============================================

echo "============================================"
echo "  Gestor de Tareas para Equipos"
echo "============================================"
echo ""

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no está instalado."
    echo "Por favor instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker compose &> /dev/null && ! docker-compose --version &> /dev/null; then
    echo "ERROR: Docker Compose no está disponible."
    echo "Por favor instala Docker Compose desde: https://docs.docker.com/compose/install/"
    exit 1
fi

DOCKER_COMPOSE_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "Docker instalado: $(docker --version)"
echo "Docker Compose: $($DOCKER_COMPOSE_CMD --version)"
echo ""

# Crear .env desde .env.example si no existe
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ .env creado desde .env.example"
    echo ""
else
    echo "✓ .env ya existe"
    echo ""
fi

# Verificar que el archivo .env tenga los valores necesarios
source .env

if [ -z "$DB_USERNAME" ]; then
    echo "ADVERTENCIA: DB_USERNAME no está definido en .env"
fi
if [ -z "$DB_PASSWORD" ]; then
    echo "ADVERTENCIA: DB_PASSWORD no está definido en .env"
fi

# Construir e iniciar los servicios
echo "============================================"
echo "  Construyendo e iniciando servicios..."
echo "============================================"
echo ""

$DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true

echo "Construyendo imágenes Docker..."
$DOCKER_COMPOSE_CMD build --no-cache

echo ""
echo "Iniciando servicios..."
$DOCKER_COMPOSE_CMD up -d

echo ""
echo "============================================"
echo "  Verificando estado de servicios..."
echo "============================================"
echo ""

# Esperar a que los servicios estén healthy
MAX_WAIT=120
WAIT_COUNT=0

check_service_healthy() {
    local service=$1
    local status
    status=$($DOCKER_COMPOSE_CMD ps --format json 2>/dev/null | grep -o "\"Service\":\"$service\",\"State\":\"healthy\"" || echo "")
    [ -n "$status" ]
}

echo "Esperando a que postgres esté saludable..."
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if check_service_healthy "postgres"; then
        echo "✓ postgres está saludable"
        break
    fi
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
done

if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
    echo "ERROR: postgres no está disponible después de $MAX_WAIT segundos"
    echo ""
    echo "Logs de postgres:"
    $DOCKER_COMPOSE_CMD logs postgres
    exit 1
fi

WAIT_COUNT=0
echo "Esperando a que backend esté saludable..."
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if check_service_healthy "backend"; then
        echo "✓ backend está saludable"
        break
    fi
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
done

if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
    echo "ERROR: backend no está disponible después de $MAX_WAIT segundos"
    echo ""
    echo "Logs de backend:"
    $DOCKER_COMPOSE_CMD logs backend
    exit 1
fi

WAIT_COUNT=0
echo "Esperando a que frontend esté saludable..."
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if check_service_healthy "frontend"; then
        echo "✓ frontend está saludable"
        break
    fi
    sleep 2
    WAIT_COUNT=$((WAIT_COUNT + 2))
done

if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
    echo "ERROR: frontend no está disponible después de $MAX_WAIT segundos"
    echo ""
    echo "Logs de frontend:"
    $DOCKER_COMPOSE_CMD logs frontend
    exit 1
fi

echo ""
echo "============================================"
echo "  ¡Aplicación iniciada correctamente!"
echo "============================================"
echo ""
echo "  Frontend: http://localhost:${FRONTEND_PORT:-23002}"
echo "  Backend:  http://localhost:${BACKEND_PORT:-3000}"
echo "  API Docs: http://localhost:${BACKEND_PORT:-3000}/api"
echo ""
echo "  Credenciales de prueba (primera vez):"
echo "  - Registrar un usuario desde el frontend"
echo "  - O crear admin inicial via API si es necesario"
echo ""
echo "============================================"
echo "  Comandos útiles:"
echo "============================================"
echo "  Ver logs:        $DOCKER_COMPOSE_CMD logs -f"
echo "  Detener:         $DOCKER_COMPOSE_CMD down"
echo "  Reiniciar:       $DOCKER_COMPOSE_CMD restart"
echo "  Estado:          $DOCKER_COMPOSE_CMD ps"
echo ""
