# ⚡ Guía de Inicio Rápido

## 🚀 Comenzar en 3 Pasos

### Paso 1: Instalar Dependencias
```bash
pnpm install
```

### Paso 2: Iniciar Base de Datos
```bash
# Iniciar PostgreSQL con Docker
pnpm run docker:up

# Aplicar el esquema de Prisma
pnpm run prisma:push
```

### Paso 3: Iniciar Aplicación
```bash
pnpm run start:dev
```

✅ **La aplicación está corriendo en:** http://localhost:3000

---

## 🧪 Prueba Rápida

### 🔐 Autenticación

#### 1. Registrar un usuario
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test User"}'
```

#### 2. Iniciar sesión
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

**Respuesta (guarda el sessionToken):**
```json
{
  "success": true,
  "user": { ... },
  "session": {
    "sessionToken": "aBcDeFgH...",
    "expires": "2025-11-28T..."
  }
}
```

#### 3. Usar el token en requests protegidos
```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer TU_SESSION_TOKEN"
```

---

### 📋 CRUD de Usuarios y Tareas

### 1. Crear un usuario (método alternativo)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

**Respuesta:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "test@example.com",
  "password": "123456",
  "createdAt": "2025-10-29T15:30:00.000Z",
  "tasks": []
}
```

### 2. Crear una tarea
⚠️ **Reemplaza `USER_ID` con el ID que recibiste en el paso anterior**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi primera tarea","description":"Aprender NestJS","userId":"USER_ID"}'
```

### 3. Ver todas las tareas
```bash
curl http://localhost:3000/tasks
```

### 4. Ver el usuario con sus tareas
```bash
curl http://localhost:3000/users/USER_ID
```

---

## 🎯 Alternativa: Usar el archivo api-test.http

Si usas VS Code con la extensión **REST Client**:

1. Abre el archivo `api-test.http`
2. Haz clic en "Send Request" sobre cada línea que empiece con `###`
3. Los IDs se capturan automáticamente entre requests

---

## 🗄️ Ver la Base de Datos

Abre Prisma Studio para ver los datos de forma visual:

```bash
pnpm run prisma:studio
```

Se abrirá en http://localhost:5555

---

## 📋 Comandos Útiles

```bash
# Ver logs de la base de datos
pnpm run docker:logs

# Detener la base de datos
pnpm run docker:down

# Reiniciar la base de datos
pnpm run docker:restart

# Ver la estructura de la base de datos
pnpm run prisma:studio
```

---

## 🔧 Solución de Problemas

### La aplicación no inicia
```bash
# Verificar que la base de datos esté corriendo
docker ps

# Si no aparece, iniciarla
pnpm run docker:up
```

### Error de conexión a la base de datos
```bash
# Verificar que el puerto 5435 esté libre
lsof -i :5435

# Verificar que el .env tenga la URL correcta
cat .env
```

### Resetear todo
```bash
# Detener y eliminar base de datos
pnpm run docker:down
docker volume rm better-auth-project_postgres_data

# Volver a iniciar
pnpm run docker:up
pnpm run prisma:push
pnpm run start:dev
```

---

## 📚 Siguiente Paso

Lee la documentación completa en:
- [API-ENDPOINTS.md](./API-ENDPOINTS.md) - Todos los endpoints disponibles
- [PRISMA-SETUP.md](./PRISMA-SETUP.md) - Configuración de Prisma
- [DOCKER-SETUP.md](./DOCKER-SETUP.md) - Configuración de Docker
- [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) - Estructura del proyecto

---

## 🎉 ¡Listo!

Ya tienes un backend completo con:
- ✅ API REST con CRUD completo
- ✅ Base de datos PostgreSQL
- ✅ ORM con Prisma
- ✅ Relaciones entre entidades
- ✅ TypeScript
- ✅ NestJS

