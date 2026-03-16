# Pruebas frontend (`src/tests`)

## Objetivo del test implementado

El test de `App.test.jsx` valida el flujo mínimo de la pantalla principal:

1. La app consulta usuarios (`fetch` a `/api/users/`).
2. Se renderiza una opción de usuario en el `<select>` (`Ana Paz`).
3. Al seleccionar ese usuario, se habilita el botón para revisar tareas.

En resumen: prueba que la UI reacciona correctamente cuando la carga de usuarios es exitosa.

## Cómo funciona el test

Archivo: `src/tests/App.test.jsx`

- Usa **Vitest** como runner.
- Usa **React Testing Library** para renderizar y consultar elementos del DOM.
- Usa **MemoryRouter** porque `App` depende de `react-router-dom`.
- Mockea `global.fetch` con `vi.fn().mockResolvedValue(...)` para no depender del backend real.
- Verifica:
  - Que existe la opción `Ana Paz`.
  - Que el botón "Revisar tareas de Ana Paz" queda habilitado tras seleccionar usuario.

## Archivos de soporte

- `src/tests/setup.js`: carga `@testing-library/jest-dom/vitest` para matchers como `toBeInTheDocument`.
- `vite.config.js`:
  - `test.environment = 'jsdom'`
  - `test.setupFiles = './src/tests/setup.js'`
- `package.json`:
  - Script `test`: `vitest run`
  - Script `test:watch`: `vitest`

## Comandos (Docker Compose)

Ejecutar desde la raíz del proyecto (`/home/darthbane/prueba_tecnica`):

```bash
docker compose run --rm --no-deps frontend npm run test
```

Modo watch:

```bash
docker compose run --rm --no-deps frontend npm run test:watch
```

Instalar dependencias de test (si faltan):

```bash
docker compose run --rm --no-deps frontend npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## Qué cubre y qué no cubre

Sí cubre:
- Render inicial de `App`.
- Carga exitosa de usuarios simulada con mock.
- Interacción básica de selección + estado del botón.

No cubre:
- Navegación final (`navigate`) al hacer click.
- Estados de error del backend.
- Flujo real contra API levantada (esto sería integración/e2e).
