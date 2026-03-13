# Plan de acción para construir software con IA

## 1. Preparar entorno base operativo

1.1 Actualizar sistema operativo															LISTO
1.2 Verificar terminal y shell de trabajo												LISTO
1.3 Instalar Git																					LISTO
1.4 Configurar Git global (user.name, user.email, rama por defecto)		LISTO
1.5 Instalar VS Code o editor de trabajo												LISTO
1.6 Instalar Docker Engine																	LISTO
1.7 Instalar Docker Compose plugin													LISTO
1.8 Agregar tu usuario al grupo Docker												LISTO
1.9 Reiniciar sesión y validar permisos Docker										LISTO
1.10 Instalar Node.js y npm																LISTO
1.11 Instalar Python 3, pip y venv														LISTO
1.12 Instalar cliente PostgreSQL															LISTO
1.13 Instalar utilidades base (curl, wget, build-essential, jq, etc.)			LISTO
1.14 Verificar que los puertos típicos del proyecto estén disponibles		LISTO
	
	3000 libre 														Frontend ---> REACT
	5173 libre														Vite (Para levantar servicio adicional, por si acaso)
	8000 libre														Backend (Django/FastAPI)
	8080 libre														app alternativa
	5432 ocupado por PostgreSQL local				PostgreSQL
	80 libre															HTTP
	443 libre														HTTPS
	
1.15 Crear carpeta base de trabajo														LISTO
1.16 Validar versiones de herramientas instaladas								LISTO

## 2. Inicializar repositorio

2.1 Crear carpeta raíz del proyecto															LISTO
2.2 Abrir la carpeta en el editor de trabajo
2.3 Inicializar repositorio Git
2.4 Verificar rama principal
2.5 Configurar .gitignore
2.6 Crear README.md inicial
2.7 Crear archivo .env.example
2.8 Definir estructura mínima de carpetas raíz
2.9 Hacer primer commit base
2.10 Crear repositorio remoto
2.11 Vincular repositorio local con remoto
2.12 Subir commit inicial al remoto
2.13 Verificar que el remoto quedó correctamente enlazado
2.14 Confirmar que el repositorio clona y abre sin fricción

## 3. Crear estructura base del proyecto
## 4. Configurar Docker Compose base
## 5. Levantar base de datos en contenedor
## 6. Levantar backend base en contenedor
## 7. Levantar frontend base en contenedor
## 8. Implementar modelo de datos
## 9. Implementar API de tareas
## 10. Validar persistencia de datos
## 11. Implementar vista principal de tareas
## 12. Implementar formulario de creación
## 13. Conectar listado de tareas a la API
## 14. Implementar cambio de estado de tareas
## 15. Validar flujo completo de crear, listar y actualizar
## 16. Estabilizar integración frontend-backend
## 17. Implementar prueba básica de backend
## 18. Implementar prueba básica de frontend
## 19. Implementar manejo básico de errores
## 20. Integrar funcionalidad IA
## 21. Mostrar resultado IA en la interfaz
## 22. Limpiar y ordenar el proyecto
## 23. Preparar README mínimo
## 24. Validar demo técnica final
