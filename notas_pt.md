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

docker compose up -d db ---> para levantar el servicio (desde la raíz del proyecto) pero sólo 
docker compose up -d backend
base de datos