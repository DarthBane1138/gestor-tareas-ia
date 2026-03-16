# Prueba Técnica Fullstack IA

Aplicación fullstack para gestión de tareas con:
- `frontend`: React + Vite
- `backend`: Django + DRF
- `db`: PostgreSQL 16

El entorno de desarrollo está pensado para correr con Docker Compose.

## Prerrequisitos
- Docker instalado y corriendo.
- Plugin Docker Compose disponible (`docker compose version`).

## Configuración inicial
1. Clonar el repositorio.
2. Crear archivo de entorno local:

```bash
cp .env.example .env
```

3. Completar `GEMINI_API_KEY` en `.env` para habilitar clasificación IA.
4. Verificar que los puertos estén libres en tu host:
- `5173` (frontend)
- `8000` (backend)
- `5432` (postgres)

## Levantar el entorno

```bash
docker compose up -d --build
```

Servicios esperados:
- `db`
- `backend`
- `frontend`

## Verificación funcional
1. Verificar estado de contenedores:

```bash
docker compose ps
```

2. Verificar salud del backend:

```bash
curl -sS http://localhost:8000/api/health/
```

Respuesta esperada:

```json
{"status":"ok"}
```

3. Abrir frontend:
- `http://localhost:5173`

Interfaces locales de uso:
- Frontend: `http://localhost:5173`
- API backend: `http://localhost:8000/api`

## Tests

Test backend (health endpoint):

```bash
docker compose run --rm backend python manage.py test api.tests.test_health
```

Test frontend (Vitest):

```bash
docker compose run --rm --no-deps frontend npm run test
```

## Base de datos y persistencia
- La configuración de la base está versionada en git.
- Los datos NO viajan en el repositorio.
- Los datos viven en el volumen Docker `postgres_data`.
- `docker compose down` detiene y elimina contenedores, pero conserva volúmenes.
- `docker compose down -v` elimina también volúmenes (pierdes datos persistidos).
- En un clon nuevo no viajan tus registros previos.

Nota práctica:
- Si levantas en otro entorno, PostgreSQL se crea, pero el contenido previo de tu volumen local no se replica automáticamente.

## Operación diaria

Ver logs backend:

```bash
docker compose logs -f backend
```

Reiniciar backend:

```bash
docker compose restart backend
```

Detener entorno:

```bash
docker compose down
```

## Troubleshooting rápido
- Puertos ocupados: cambiar puertos en `.env` o liberar puertos locales.
- Permisos de archivos en volúmenes: revisar `UID`, `GID`, `HOST_UID`, `HOST_GID` en `.env`.
- Clasificación IA no disponible: verificar `GEMINI_API_KEY` y revisar `docker compose logs -f backend`.
