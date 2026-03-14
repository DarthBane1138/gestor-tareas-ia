# Plan de acción para construir software con IA

## 1. Preparar entorno base operativo									LISTO

1.1 Actualizar sistema operativo										LISTO
1.2 Verificar terminal y shell de trabajo								LISTO
1.3 Instalar Git														LISTO
1.4 Configurar Git global (user.name, user.email, rama por defecto)		LISTO
1.5 Instalar VS Code o editor de trabajo								LISTO
1.6 Instalar Docker Engine												LISTO
1.7 Instalar Docker Compose plugin										LISTO
1.8 Agregar tu usuario al grupo Docker									LISTO
1.9 Reiniciar sesión y validar permisos Docker							LISTO
1.10 Instalar Node.js y npm												LISTO
1.11 Instalar Python 3, pip y venv										LISTO
1.12 Instalar cliente PostgreSQL										LISTO
1.13 Instalar utilidades base (curl, wget, build-essential, jq, etc.)	LISTO
1.14 Verificar que los puertos típicos del proyecto estén disponibles	LISTO
	
	5173 libre 								Frontend ---> REACT/Vite
	8000 libre								Backend (Django/FastAPI)
	8080 libre								app alternativa
	5432 Postgre apagado, libre				PostgreSQL
	80 libre								HTTP
	443 libre								HTTPS
	
1.15 Crear carpeta base de trabajo										LISTO
1.16 Validar versiones de herramientas instaladas						LISTO

## 2. Inicializar repositorio																LISTO

2.1 Crear carpeta raíz del proyecto															LISTO
2.2 Abrir la carpeta en el editor de trabajo												LISTO
2.3 Inicializar repositorio Git																LISTO
2.4 Verificar rama principal																LISTO
2.5 Configurar .gitignore																	LISTO			
2.6 Crear README.md inicial																	LISTO								
2.7 Crear archivo .env.example																LISTO
2.8 Definir estructura mínima de carpetas raíz												LISTO		
2.9 Hacer primer commit base																LISTO
2.10 Crear repositorio remoto																LISTO
2.11 Vincular repositorio local con remoto													LISTO
2.12 Subir commit inicial al remoto															LISTO
2.13 Verificar que el remoto quedó correctamente enlazado									LISTO
2.14 Confirmar que el repositorio clona y abre sin fricción									LISTO								

## 3. Configurar Docker Compose base														PENDIENTE (no se han configurado backen/frontend)
## 4. Levantar base de datos en contenedor													LISTO
## 5. Levantar backend base en contenedor
## 6. Levantar frontend base en contenedor
## 7. Implementar modelo de datos
## 8. Implementar API de tareas
## 9. Validar persistencia de datos
## 10. Implementar vista principal de tareas
## 11. Implementar formulario de creación
## 12. Conectar listado de tareas a la API
## 13. Implementar cambio de estado de tareas
## 14. Validar flujo completo de crear, listar y actualizar
## 15. Estabilizar integración frontend-backend
## 16. Implementar prueba básica de backend
## 17. Implementar prueba básica de frontend
## 18. Implementar manejo básico de errores
## 19. Integrar funcionalidad IA
## 20. Mostrar resultado IA en la interfaz
## 21. Limpiar y ordenar el proyecto
## 22. Preparar README mínimo
## 23. Validar demo técnica final
