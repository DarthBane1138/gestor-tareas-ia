# Pruebas backend (`api/tests`)

## Qué estás probando con `test_health.py`

Este test verifica que el endpoint de salud de la API responde correctamente:

- URL: `/api/health/`
- Método: `GET`
- Estado esperado: `200 OK`
- Cuerpo JSON esperado: `{"status": "ok"}`

En otras palabras, valida que el backend está vivo y que la ruta básica de chequeo funciona.

## Explicación del test línea por línea

Archivo: `test_health.py`

1. `SimpleTestCase`  
   Se usa para pruebas que **no requieren base de datos**.

2. `APIClient`  
   Simula un cliente HTTP para llamar endpoints DRF como si fuera un consumidor real.

3. `setUp(self)`  
   Se ejecuta antes de cada test y crea `self.client`.

4. `test_health_endpoint_returns_ok(self)`  
   Hace `GET /api/health/` y valida:
   - `response.status_code == 200`
   - `response.json() == {"status": "ok"}`

## Por qué este test es útil

- Es rápido y estable.
- Detecta regresiones tempranas en enrutamiento/configuración básica del backend.
- Sirve como prueba mínima inicial para la entrega.

## Qué NO cubre este test

- No valida lógica de tareas, usuarios o categorías.
- No valida autenticación/autorización.
- No prueba integración con base de datos ni servicios externos (IA).

## Cómo ejecutarlo

Desde la raíz del proyecto:

```bash
docker compose run --rm backend python manage.py test api.tests.test_health
```

También puedes correr todos los tests del app `api`:

```bash
docker compose run --rm backend python manage.py test api
```

## Cómo leer el resultado

- Si ves `OK`, el test pasó.
- Si ves `FAILED`, revisa:
  - Que la URL siga siendo `/api/health/`
  - Que la vista devuelva `{"status": "ok"}`
  - Que la ruta esté incluida en `api/urls.py`
