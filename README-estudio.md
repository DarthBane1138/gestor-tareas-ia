# README de Estudio - Prueba Técnica Fullstack IA

## 1. Propósito

Este documento resume los conceptos más importantes de la prueba técnica, pero con un criterio claro:

- enfocarse en lo que realmente usamos en el proyecto
- explicar por qué cada tecnología existe en la solución
- dejar una base útil para defender decisiones técnicas

El stack real del proyecto es:

- `frontend`: React + Vite
- `backend`: Django + Django REST Framework
- `db`: PostgreSQL 16
- orquestación local: Docker Compose
- validación CI/CD: GitHub Actions

---

## 2. Vista general del sistema

La aplicación tiene tres piezas principales:

1. el `frontend` muestra la interfaz y hace requests HTTP
2. el `backend` expone la API y ejecuta la lógica de negocio
3. la `base de datos` guarda la información persistente

El flujo general es este:

1. el usuario interactúa con React
2. React llama endpoints del backend, por ejemplo `/api/users/`
3. Django/DRF procesa la request
4. Django consulta o modifica PostgreSQL
5. el backend responde JSON al frontend

Además, existe un endpoint de clasificación con IA que consulta Gemini desde el backend.

---

## 3. Arquitectura aplicada en este proyecto

El archivo central de orquestación es [`docker-compose.yml`](./docker-compose.yml).

Servicios definidos:

- `db`: contenedor de PostgreSQL
- `backend`: contenedor con Django
- `frontend`: contenedor con React + Vite

Qué resuelve Docker Compose acá:

- levanta todo el entorno con un solo comando
- conecta servicios entre sí por red interna
- usa variables de entorno desde `.env`
- expone puertos para probar localmente
- monta el código local para desarrollo

Esto es importante: el Compose actual está pensado principalmente para desarrollo, porque:

- el backend corre con `runserver`
- el frontend corre con `npm run dev`
- se usan bind mounts del código local

Sirve muy bien para desarrollo, pruebas locales y validaciones CI previas al despliegue.

---

## 4. Docker y Docker Compose: ideas clave

### ¿Qué es Docker?

Docker permite empaquetar una aplicación con su entorno en una imagen para ejecutarla de forma consistente en distintos entornos.

### ¿Qué es una imagen?

Es una plantilla inmutable que contiene:

- sistema base
- dependencias
- código
- configuración de ejecución

### ¿Qué es un contenedor?

Es una instancia en ejecución de una imagen.

### ¿Qué aporta Docker Compose?

Compose sirve para definir varios servicios relacionados en un solo archivo YAML.

En este proyecto lo usamos para:

- `db`
- `backend`
- `frontend`

### Conceptos de Compose que sí usamos

#### `services`

Define cada contenedor lógico del sistema.

#### `build`

Le dice a Docker desde qué carpeta construir la imagen.

Ejemplo:

- `backend` se construye desde `./backend`
- `frontend` se construye desde `./frontend`

#### `image`

Usa una imagen existente. En este caso:

- `postgres:16`

#### `ports`

Mapea puertos del host hacia el contenedor.

Ejemplo:

- `${BACKEND_PORT}:8000`
- `${FRONTEND_PORT}:5173`

Eso permite abrir en el navegador o con `curl` los servicios que corren dentro de Docker.

#### `volumes`

Sirven para persistir datos o montar carpetas locales.

En este proyecto:

- `postgres_data` persiste la base de datos
- `./backend:/app` monta el código del backend
- `./frontend:/app` monta el código del frontend

#### `depends_on`

Expresa dependencias básicas de arranque entre servicios.

Ejemplo:

- `backend` depende de `db`

Importante:
- ayuda al orden de arranque
- no garantiza por sí solo que PostgreSQL ya esté listo para recibir conexiones

#### `command`

Sobrescribe el comando de arranque del contenedor.

En este proyecto:

- backend: `python3 manage.py runserver 0.0.0.0:8000`
- frontend: `npm run dev -- --host`

#### `networks`

Permite comunicación entre contenedores.

Por eso Django puede conectarse a PostgreSQL usando `POSTGRES_HOST=db`.

---

## 5. Variables de entorno, `.env` y secrets

### ¿Qué es una variable de entorno?

Es un valor externo al código que se usa para configurar el comportamiento de la aplicación en tiempo de ejecución.

Ejemplos del proyecto:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `GEMINI_API_KEY`
- `ALLOWED_HOSTS`

### ¿Qué es `.env`?

Es un archivo de texto con pares `CLAVE=valor`.

En este proyecto se usa para:

- centralizar configuración local
- evitar hardcodear ciertos valores en el código
- alimentar Docker Compose

### ¿Qué no debería hardcodearse?

Especialmente en un contexto real de despliegue:

- claves privadas
- contraseñas
- API keys
- `SECRET_KEY` de Django

### Diferencia entre variable y secret

- `variable`: dato de configuración no sensible
- `secret`: dato sensible que no debería quedar expuesto en logs ni en el repositorio

Ejemplo:

- `GEMINI_MODEL` es variable
- `GEMINI_API_KEY` es secret

### Por qué fue importante en GitHub Actions

En GitHub Actions el runner no tiene tu `.env` local.
Por eso, antes de correr `docker compose`, hubo que crear un `.env` temporal desde `GitHub Secrets`.

---

## 6. PostgreSQL: lo importante para esta prueba

### ¿Qué es PostgreSQL?

Es un sistema de gestión de base de datos relacional.

### ¿Qué significa “relacional”?

Que la información vive en tablas relacionadas entre sí por claves.

### ¿Qué rol cumple en el proyecto?

Persistir información como:

- usuarios
- tareas
- categorías

### ¿Cómo se conecta Django?

Desde [`backend/config/settings.py`](./backend/config/settings.py), leyendo:

- nombre de base
- usuario
- contraseña
- host
- puerto

### ¿Qué es `psycopg[binary]`?

Es el adaptador que permite que Python se conecte a PostgreSQL.

### ¿Qué hace el volumen `postgres_data`?

Guarda los datos de la base aunque el contenedor se reinicie o se vuelva a crear.

### Diferencia importante

- `docker compose down`
  detiene y elimina contenedores, pero conserva volúmenes
- `docker compose down -v`
  también elimina volúmenes, por lo que se pierden los datos persistidos

### `search_path`

En PostgreSQL define el esquema donde primero buscar tablas.
En este proyecto se configuró:

- `tasks`
- `public`

---

## 7. Django: por qué está en el proyecto y cómo funciona

### ¿Qué es Django?

Es un framework backend en Python que resuelve gran parte de la infraestructura típica de una aplicación web:

- configuración
- URLs
- vistas
- acceso a base de datos
- seguridad básica
- administración

### ¿Por qué se usa acá?

Porque permite construir rápido un backend robusto y estructurado.

### Archivo importante: `settings.py`

[`backend/config/settings.py`](./backend/config/settings.py) concentra la configuración principal:

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `INSTALLED_APPS`
- `MIDDLEWARE`
- `DATABASES`

### Conceptos clave de Django aplicados acá

#### `SECRET_KEY`

Clave interna de Django para mecanismos de seguridad.
En producción debería venir desde variable de entorno.

#### `DEBUG`

Cuando está en `True`, Django muestra errores detallados.
Es útil en desarrollo, pero no en producción.

#### `ALLOWED_HOSTS`

Lista de hosts permitidos por Django.
Ayuda a evitar requests con hosts inválidos o maliciosos.

#### `INSTALLED_APPS`

Define qué apps están activas.

En este proyecto:

- apps base de Django
- `rest_framework`
- `api`

#### `MIDDLEWARE`

Son capas que procesan cada request y response.

Ejemplos:

- seguridad
- sesiones
- CSRF
- autenticación

#### `DATABASES`

Define cómo Django se conecta a PostgreSQL.

---

## 8. Django REST Framework: cómo funciona y por qué se usa

### ¿Qué es DRF?

Django REST Framework es una extensión de Django para construir APIs web de forma más clara y productiva.

### ¿Por qué usar DRF y no solo Django “puro”?

Porque DRF simplifica tareas muy comunes de una API:

- recibir JSON
- validar datos de entrada
- serializar datos de salida
- trabajar con vistas orientadas a API
- devolver respuestas HTTP consistentes

### Conceptos principales de DRF usados en el proyecto

#### `APIView`

Es una clase base para construir endpoints de API con más control manual.

La usamos, por ejemplo, en:

- healthcheck
- completar tarea
- actualizar estado
- clasificación con IA

Es útil cuando la lógica no encaja de forma directa en una vista CRUD estándar.

#### Generic views

DRF trae vistas genéricas para patrones frecuentes.

En este proyecto aparecen:

- `ListAPIView`
- `ListCreateAPIView`

¿Por qué sirven?

- reducen código repetido
- integran bien serializers y querysets
- son ideales para listar o crear recursos comunes

#### Serializer

Es uno de los conceptos más importantes de DRF.

Sirve para:

- validar datos de entrada
- transformar objetos Python/modelos en JSON
- transformar JSON en estructuras válidas para la aplicación

En este proyecto los serializers ayudan a estructurar:

- categorías
- usuarios
- tareas
- request/response del endpoint de IA

#### `Response`

Es la respuesta HTTP de DRF.
Permite devolver datos estructurados, usualmente JSON, con códigos de estado claros.

#### `status`

DRF trae constantes legibles para estados HTTP:

- `HTTP_200_OK`
- `HTTP_400_BAD_REQUEST`
- `HTTP_404_NOT_FOUND`
- `HTTP_503_SERVICE_UNAVAILABLE`

Eso mejora claridad y mantenimiento.

### Endpoint de salud

Ruta:

- `/api/health/`

Objetivo:

- confirmar que el backend está vivo

Respuesta esperada:

```json
{"status": "ok"}
```

Este endpoint es clave porque sirve para:

- pruebas locales rápidas
- smoke tests
- validaciones de CI/CD

### Endpoint de clasificación con IA

Está documentado en [`docs/ai_endpoint_contract.md`](./docs/ai_endpoint_contract.md).

Ruta:

- `POST /api/users/{user_id}/tasks/classify/`

Objetivo:

- sugerir la categoría de una tarea nueva

Importante:

- no crea registros
- no actualiza registros
- solo devuelve una sugerencia

Errores relevantes:

- `400 validation_error`
- `404 user_not_found`
- `503 ai_unavailable`

---

## 9. React: por qué se usa y cómo pensar su rol

### ¿Qué es React?

Es una biblioteca para construir interfaces basadas en componentes.

### ¿Por qué se usa acá?

Porque permite modelar la UI como piezas reutilizables y manejar bien el estado de la pantalla.

### Ideas clave de React aplicadas en este proyecto

#### Componentes

Cada pantalla o bloque visual puede pensarse como una unidad reutilizable.

#### Estado

El estado representa datos que cambian en el tiempo.

Ejemplos:

- lista de usuarios
- usuario seleccionado
- loading
- error

#### `useEffect`

Se usa para ejecutar efectos secundarios, como cargar datos del backend cuando la pantalla se monta.

#### `useNavigate`

Viene de `react-router-dom` y permite navegar entre rutas desde código.

#### Fetch al backend

El frontend hace requests como:

- `/api/users/`
- `/api/categories/`
- `/api/users/{id}/tasks/`

Eso muestra que el frontend depende de la API para renderizar información real.

### Ventaja importante del enfoque actual

El frontend consume rutas relativas `/api/...`.
Eso simplifica bastante el trabajo cuando frontend y backend comparten dominio o proxy.

---

## 10. Vite: qué es, cómo funciona y por qué es liviano

### ¿Qué es Vite?

Es una herramienta de desarrollo y build para frontend moderno.

### ¿Por qué se usa en este proyecto?

Porque hace muy ágil el trabajo con React, tanto en desarrollo como en build.

### ¿Por qué Vite se percibe “liviano” o rápido?

Principalmente por su enfoque de desarrollo:

- usa módulos ES nativos en el navegador
- no hace un bundle completo de toda la app en cada arranque
- preprocesa dependencias para servirlas más rápido
- tiene recarga rápida de módulos con HMR

Eso reduce mucho el tiempo de espera durante desarrollo.

### ¿Qué hace en desarrollo?

Con `npm run dev` levanta un servidor de desarrollo rápido y reactivo.

### ¿Qué hace en build?

Con `npm run build` genera una versión optimizada para producción.

### Scripts importantes del proyecto

En [`frontend/package.json`](./frontend/package.json):

- `dev`
- `build`
- `test`
- `preview`

### `engines`

El frontend declara:

- Node `>=22.12.0 <23`
- npm `>=10`

Eso ayuda a mantener consistencia entre entornos.

---

## 11. Testing aplicado en el proyecto

## Backend

El test actual está en [`backend/api/tests/test_health.py`](./backend/api/tests/test_health.py).

### ¿Qué valida?

- `GET /api/health/`
- status `200`
- respuesta `{"status": "ok"}`

### ¿Por qué es valioso?

Porque es:

- rápido
- estable
- barato de ejecutar
- útil como validación mínima del backend

### `SimpleTestCase`

Se usa cuando no hace falta base de datos.
Eso vuelve el test más liviano.

### `APIClient`

Simula requests HTTP sobre la API para probar endpoints sin depender de un navegador.

## Frontend

El test actual está en [`frontend/src/tests/App.test.jsx`](./frontend/src/tests/App.test.jsx).

Herramientas usadas:

- Vitest
- React Testing Library
- `MemoryRouter`

### ¿Qué valida?

- carga simulada de usuarios
- render del usuario en el `<select>`
- habilitación del botón al elegir usuario

### `global.fetch` mockeado

Se mockea para no depender del backend real en esta prueba.

Eso permite:

- tests más rápidos
- menos fragilidad
- foco en el comportamiento de la UI

---

## 12. GitHub Actions y CI/CD en esta prueba

### ¿Qué es GitHub Actions?

Es la plataforma de automatización de GitHub para ejecutar workflows sobre el repositorio.

### ¿Qué es CI?

Integración continua.
Consiste en correr validaciones automáticas cada vez que cambia el código.

### ¿Qué es CD?

Entrega o despliegue continuo.
Consiste en automatizar pasos posteriores a la validación, como publicación o despliegue.

### ¿Qué estamos aplicando realmente?

Hasta ahora nos enfocamos en una escalera de validación:

1. `docker compose config`
2. tests backend
3. tests frontend
4. build de imágenes Docker
5. smoke test local con Compose

### ¿Qué hace hoy el workflow?

En [`deploy.yml`](./.github/workflows/deploy.yml):

- hace checkout del repositorio
- crea un `.env` temporal
- valida la configuración de Compose
- lista los servicios detectados

Esto hoy es más una base de CI que un despliegue real.

### ¿Por qué hubo que crear un `.env` temporal?

Porque el runner de GitHub:

- no tiene tu `.env` local
- sí puede acceder a `GitHub Secrets`

Entonces el workflow genera ese archivo temporal antes de usar `docker compose`.

### `docker compose config -q`

Sirve para validar:

- sintaxis del Compose
- resolución de variables
- consistencia básica de la configuración

Y con `-q` evita imprimir la configuración completa, lo que ayuda a no exponer secrets.

### `docker compose config --services`

Lista los servicios detectados:

- `db`
- `backend`
- `frontend`

### ¿Qué es un runner?

Es la máquina donde GitHub ejecuta el workflow.

Importante:

- los runners hospedados por GitHub son efímeros
- sirven para validar
- no sirven como hosting permanente de la app

---

## 13. Smoke test: qué es y por qué importa

Un smoke test es una prueba mínima para verificar que el sistema “respira”.

En este proyecto, un smoke test razonable sería:

1. levantar servicios con Compose
2. consultar `/api/health/`

Ejemplo:

```bash
docker compose up -d --build
curl -sS http://localhost:8000/api/health/
```

Esto no prueba toda la aplicación, pero sí confirma algo muy importante:

- el backend arrancó
- el ruteo funciona
- hay respuesta HTTP correcta

---

## 14. Diferencia entre validar y desplegar

Esta distinción es clave para explicar el proyecto.

### Validar

Es comprobar que:

- la configuración está bien
- los tests pasan
- las imágenes construyen
- la aplicación arranca en un entorno temporal

### Desplegar

Es dejar la aplicación corriendo en un entorno persistente para uso real.

En esta prueba nos concentramos más en la parte de validación automatizada previa al despliegue.

---

## 15. Preguntas que sí tienen sentido en esta prueba

### ¿Qué valida `docker compose config`?

Valida sintaxis y resolución de variables del archivo Compose.
No prueba que la aplicación arranque.

### ¿Por qué usar Docker Compose?

Porque permite levantar frontend, backend y base con una sola definición y facilita desarrollo y validación local.

### ¿Por qué usar DRF?

Porque simplifica la construcción de APIs:

- serializers
- vistas de API
- respuestas JSON
- validación de datos

### ¿Por qué usar Vite?

Porque el desarrollo es rápido y liviano:

- arranca rápido
- recarga módulos con HMR
- evita el costo de bundlear todo en cada cambio

### ¿Por qué usar un endpoint `/api/health/`?

Porque es una prueba mínima, estable y automatizable del backend.

### ¿Por qué usar tests separados en frontend y backend?

Porque prueban responsabilidades distintas:

- backend: respuesta de la API
- frontend: comportamiento de la UI

### ¿Por qué GitHub Secrets y no el `.env` local?

Porque el `.env` local no viaja al runner y porque los secretos no deben quedar en el repositorio.

### ¿Por qué GitHub Actions no es un entorno de producción?

Porque el runner es temporal y desaparece al terminar el workflow.

---

## 16. Resumen final para defensa oral

La idea principal de esta prueba es demostrar que puedo:

- entender la arquitectura de una app fullstack
- levantar el entorno con Docker Compose
- separar responsabilidades entre frontend, backend y base
- manejar configuración con variables de entorno
- construir una API con Django REST Framework
- consumirla desde React
- validar el sistema con tests y con GitHub Actions

En una frase:

> El proyecto usa Docker Compose para orquestar un frontend React/Vite, un backend Django/DRF y una base PostgreSQL, y se apoya en GitHub Actions para validar configuración y preparar una base sólida de CI/CD antes del despliegue real.

---

## 17. Referencias útiles del propio proyecto

- [`docker-compose.yml`](./docker-compose.yml)
- [`backend/config/settings.py`](./backend/config/settings.py)
- [`backend/api/tests/test_health.py`](./backend/api/tests/test_health.py)
- [`frontend/src/tests/App.test.jsx`](./frontend/src/tests/App.test.jsx)
- [`docs/ai_endpoint_contract.md`](./docs/ai_endpoint_contract.md)
- [`README.MD`](./README.MD)
