# Backend UTN

API REST construida con **Express (TypeScript)**, **MongoDB/Mongoose**, autenticación con **JWT**, y envío de emails con **Nodemailer (Gmail)**.

## Stack

- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Zod (validación)
- Multer (upload de imágenes)
- Nodemailer (emails)
- Morgan + logs diarios
- Rate limiting (express-rate-limit)

---

## Requisitos

- **Node.js** (recomendado **18+**) y npm
- **MongoDB** (URI de conexión)
- (Opcional) Para emails: cuenta de Gmail con **App Password**

---

## Instalación

1) Instalar dependencias:

```bash
npm install
```

2) Crear el archivo **.env** en la raíz del proyecto (ver variables abajo).

3) Levantar el proyecto en modo desarrollo:

```bash
npm run dev
```

Por defecto, el servidor levanta en `http://localhost:<PORT>`.

---

## Variables de entorno

Crear un archivo `.env` en la raíz (NO lo subas al repo). Ejemplo recomendado:

```bash
# Puerto del servidor
PORT=3000

# MongoDB (Atlas o local)
URI_DB=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME

# JWT
JWT_SECRET=tu_secret_super_seguro

# Email (Nodemailer Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail

```

### Notas importantes

- `EMAIL_PASS` **no** es tu contraseña normal: es un **App Password** de Gmail.
- Si no vas a usar el endpoint de email, podés dejar `EMAIL_USER/EMAIL_PASS` configurados igual (o comentarlos), pero el endpoint `/email/send` va a fallar si no existe un transporte válido.

---

## Scripts

- **Dev (TS en caliente):**

```bash
npm run dev
```

- **Build (compila TypeScript a /dist):**

```bash
npm run build
```

- **Ejecutar el build (producción):**

```bash
npm run start
```

---

## Estructura del proyecto

Principales carpetas/archivos:

- `src/index.ts`: inicialización del servidor, middlewares y rutas
- `src/config/mongodb.ts`: conexión a MongoDB (usa `URI_DB`)
- `src/config/emailConfig.ts`: transporte de Nodemailer (usa `EMAIL_USER` y `EMAIL_PASS`)
- `src/config/logger.ts`: logger de morgan a archivo (logs diarios)
- `src/routes/*`: routers (auth y products)
- `src/controllers/*`: lógica de endpoints
- `src/middleware/*`: auth (JWT), rate limit, upload (multer)
- `uploads/`: carpeta donde se guardan imágenes subidas (se crea si no existe)
- `logs/`: logs de acceso (en modo dev se guarda en `/logs`; en build puede terminar en `dist/logs` por el `__dirname`)

---

## Logs

Se guardan logs diarios con nombre:

- `access-YYYY-MM-DD.log`

(Se generan automáticamente al iniciar el server.)

---


## Autenticación

Los endpoints protegidos requieren header:

```
Authorization: Bearer <TOKEN>
```

El token se obtiene en `POST /auth/login`.

---

## Endpoints

**Base URL (local):** `http://localhost:<PORT>`

### Healthcheck

#### `GET /`

Respuesta:

```json
{ "status": true }
```

---

## Auth

> **Rate limit**: los endpoints de auth tienen límite de **5 requests cada 15 minutos** por IP.

### `POST /auth/register`

Crea un usuario.

**Body (JSON):**

```json
{ 
  "email": "user@mail.com",
  "password": "abc12345"
}
```

**Regla de password (Zod):** mínimo **8 caracteres**, al menos **1 letra** y **1 número**.

**Respuestas comunes:**

- `201`: `{ success: true, data: "email" }`
- `409`: usuario ya existe
- `400`: validación (Zod)

**Ejemplo cURL:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mail.com","password":"abc12345"}'
```

### `POST /auth/login`

Devuelve un JWT.

**Body (JSON):**

```json
{ 
  "email": "user@mail.com",
  "password": "abc12345"
}
```

**Respuesta exitosa:**

```json
{ "success": true, "token": "<JWT>" }
```

**Ejemplo cURL:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@mail.com","password":"abc12345"}'
```

---

## Productos

### `GET /products`

Lista productos. Soporta filtros por querystring:

- `name` (parcial, case-insensitive)
- `stock` (número)
- `category` (parcial, case-insensitive)
- `minPrice` / `maxPrice`
