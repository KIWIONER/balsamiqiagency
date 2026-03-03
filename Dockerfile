# Etapa 1: Build y compilación del Frontend con NodeJS
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar configuración de paquetes para instalar dependencias primero
COPY package*.json ./
RUN npm install

# Copiar el resto del código (El .dockerignore evita subir node_modules y .git locales)
COPY . .

# Construir sitio estático Astro (SSG)
RUN npm run build

# Etapa 2: Servidor ultraligero para tráfico rápido consumiendo mínimo de RAM (Menos de 20MB)
FROM nginx:alpine

# Copiar y reemplazar la config base de Nginx con nuestra custom optimizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados y listos ("dist") en el root de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto de Nginx
EXPOSE 80

# Levantar servidor
CMD ["nginx", "-g", "daemon off;"]
