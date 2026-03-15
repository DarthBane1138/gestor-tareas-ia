# Contrato Endpoint IA: Clasificación de tareas

## Endpoint
- Método: `POST`
- Ruta: `/api/users/{user_id}/tasks/classify/`
- Objetivo: sugerir categoría para una tarea nueva sin crear ni actualizar registros.

## Request
```json
{
  "title": "Llamar al cliente por incidente de facturación",
  "description": "Revisar cobro duplicado y enviar respuesta hoy"
}
```

### Reglas de validación
- `title`: obligatorio, `trim`, máximo 200 caracteres.
- `description`: opcional (`null` o string, permite vacío).

## Response 200
```json
{
  "suggested_category_id": 2,
  "suggested_category": "Administración",
  "confidence": 0.84,
  "reason": "La tarea menciona facturación y gestión administrativa.",
  "provider": "gemini",
  "model": "gemini-2.5-flash"
}
```

## Errores

### 400 - `validation_error`
```json
{
  "detail": "El título es obligatorio.",
  "code": "validation_error"
}
```

### 404 - `user_not_found`
```json
{
  "detail": "Usuario no encontrado.",
  "code": "user_not_found"
}
```

### 503 - `ai_unavailable`
```json
{
  "detail": "Servicio de clasificación no disponible.",
  "code": "ai_unavailable"
}
```
