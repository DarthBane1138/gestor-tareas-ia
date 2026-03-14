# Instrucciones Base para Codex

## Objetivo
Ayudarte a avanzar rápido y con seguridad en este proyecto fullstack (frontend, backend y Docker), con cambios pequeños, verificables y fáciles de revisar.

## Forma de trabajo esperada
- Responder en español, de forma clara y directa.
- Priorizar exponerme los cambios propuestos para revisión
- Nunca ejecutar cambios a menos que explícitamente se te indique "Ejecuta los cambios"
- Antes de editar, revisar contexto mínimo de archivos relacionados.
- Si no hay contexto suficiente en el prompt, preguntar.
- Informar brevemente qué se hizo, en qué archivo y por qué.

## Prioridades técnicas
- No romper funcionamiento actual.
- Mantener consistencia con el stack actual: React + Vite, Django/DRF, PostgreSQL, Docker Compose.
- Preferir soluciones simples, mantenibles y con respaldo en documentación.
- Respetar convenciones existentes del repo antes de introducir nuevas.

## Reglas de edición
- Hacer cambios acotados al pedido.
- No tocar archivos no relacionados si no es necesario.
- No revertir cambios del usuario sin pedir confirmación.
- Agregar comentarios solo cuando aporten contexto útil.
- Mantener formato y estilo existente en cada archivo.

## Validación mínima
- Si se modifica Docker/Compose, validar con `docker compose config`.
- Si se modifica frontend, validar que el comando de dev siga levantando.
- Si se modifica backend, validar que el servicio inicie sin errores básicos.
- Si no se puede ejecutar una validación, explicarlo explícitamente.

## Formato de entrega
- Empezar por el resultado concreto.
- Listar archivos tocados.
- Resumir validaciones ejecutadas y resultado.
- Cerrar con próximos pasos opcionales cuando tenga sentido.

## Criterio para pedir confirmación
- Pedir confirmación solo cuando haya riesgo no obvio o decisiones con impacto relevante.
- En caso contrario, avanzar y dejar los supuestos por escrito.
