# Notas importantes prueba de selección

## Comandos para iniciar programas

gnome-tweaks
postman
insomnia
dbeaver-ce
alacritty
sudo -u postgres psql --> Entra a PostgreSQL como admin local en la terminal

## Comandos para verificar instalaciones

git --version
docker --version
docker compose version
node -v
npm -v
python3 --version
pip3 --version
psql --version
code --version

## Comando importantes

Para el punto "2.8 Definir estructura mínima de carpetas raíz" los comandos son
Para creación de carpetas ---> mkdir -p backend frontend docs
Para creación de archivos ---> touch docker-compose.yml .env .env.example .gitignore README.md

### Docker

docker ps ---> Para listar los contenedores en ejecución
docker compose build ---> Build de todos los servicios
docker compose build db
docker compose build backend
docker compose build frontend

docker compose up -d --build frontend backend

docker compose up -d db ---> Levanta servicio base de datos
docker compose up -d backend ---> Levanta servicio de backend
docker compose up frontend

http://localhost:5173

### Tratamiento de errores

- No se publicaba puerto de base de datos, las configuraciones eran correctas. Se ejecuta

```bash
docker compose down
docker compose up -d --force--recreate db
```

### Comandos para verificación

#### Verificar versiones dentro del contenedor

docker compose run --rm --no-deps frontend node -v
docker compose run --rm --no-deps frontend npm -v

### Creación proyecto Vite en /frontend

docker compose run --rm --no-deps frontend npm create vite@latest . --template react

#### Instalación de dependencias

docker compose run --rm --no-deps frontend npm install

#### Levantar frontend en modo desarrollo

docker compose run --rm --service-ports frontend npm run dev -- --host

Si aparece error de permisos EACCES en node_modules:

--> rm -rf frontend/node_modules
--> docker compose run --rm --no-deps --user root frontend sh -lc 'mkdir -p /app/node_modules && chown -R 1000:1000 /app/node_modules'
--> docker compose run --rm --no-deps frontend npm install
--> docker compose run --rm --no-deps frontend npm install react-router-dom

## Flujo corto para uso diario (si se agrega en el servicio frontend)

docker compose up frontend

## Tests

docker compose run --rm --no-deps frontend npm run test