# 🔐 Better Auth Project - NestJS + Prisma

Sistema de autenticación completo con NestJS, Prisma y PostgreSQL.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar base de datos
pnpm run docker:up
pnpm run prisma:push

# 3. Iniciar aplicación
pnpm run start:dev
```

## 📋 Endpoints Principales

### 🔓 Autenticación (Públicas)

```
POST   /auth/signup        - Registrar usuario
POST   /auth/signin        - Iniciar sesión
GET    /auth/me            - Obtener usuario actual
POST   /auth/signout       - Cerrar sesión
GET    /auth/check-email   - Verificar email
```

### 🔒 Usuarios (Protegidas - Requieren Token)

```
GET    /users/me           - Ver mi perfil
PATCH  /users/me           - Actualizar mi perfil
DELETE /users/me           - Eliminar mi cuenta
```

### 🔒 Tareas (Protegidas - Requieren Token)

```
POST   /tasks              - Crear tarea
GET    /tasks              - Ver mis tareas
GET    /tasks/:id          - Ver tarea específica
PATCH  /tasks/:id          - Actualizar tarea
PATCH  /tasks/:id/toggle   - Alternar completado
DELETE /tasks/:id          - Eliminar tarea
```

## 🔐 Uso de Autenticación

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456","name":"User"}'
```

### 2. Iniciar Sesión

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"123456"}'
```

**Respuesta:**
```json
{
  "success": true,
  "session": {
    "sessionToken": "tu-token-aqui..."
  }
}
```

### 3. Usar Token en Requests Protegidos

```bash
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer TU_SESSION_TOKEN"
```

## 💻 Ejemplo Frontend (JavaScript)

```javascript
// 1. Login
const response = await fetch('http://localhost:3000/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@test.com', password: '123456' })
});
const data = await response.json();

// 2. Guardar token
localStorage.setItem('token', data.session.sessionToken);

// 3. Hacer requests autenticados
const tasks = await fetch('http://localhost:3000/tasks', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## 🛡️ Seguridad

- ✅ Todas las contraseñas se hashean con bcrypt
- ✅ Sesiones persistentes en base de datos
- ✅ Tokens únicos de 64 caracteres
- ✅ Expiración automática (30 días)
- ✅ Rutas protegidas con AuthGuard
- ✅ Usuarios solo acceden a sus propios datos

## 📚 Documentación

- **[docs/QUICK-START.md](./docs/QUICK-START.md)** - Inicio rápido en 3 pasos
- **[docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md)** - Guía completa de autenticación
- **[docs/IMPLEMENTACION-FINAL.md](./docs/IMPLEMENTACION-FINAL.md)** - Resumen de la implementación
- **[test-auth.http](./test-auth.http)** - Tests con REST Client

## 🔧 Scripts Disponibles

### Desarrollo
```bash
pnpm run start:dev      # Modo desarrollo
pnpm run build          # Compilar
pnpm run start:prod     # Modo producción
```

### Docker
```bash
pnpm run docker:up      # Iniciar PostgreSQL
pnpm run docker:down    # Detener PostgreSQL
pnpm run docker:logs    # Ver logs
```

### Prisma
```bash
pnpm run prisma:generate  # Generar cliente
pnpm run prisma:push      # Aplicar schema
pnpm run prisma:studio    # Abrir GUI
```

## 🗄️ Base de Datos

PostgreSQL en Docker (puerto 5435):
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `better_auth_db`

## ⚠️ Para Producción

1. Cambia `AUTH_SECRET` en `.env` (mínimo 32 caracteres)
2. Usa HTTPS siempre
3. Configura CORS apropiadamente
4. Implementa rate limiting
5. Habilita logs y monitoreo

---

**Stack:** NestJS 11 · Prisma 6 · PostgreSQL 16 · TypeScript 5 · bcrypt

Lee la [documentación completa](./docs/AUTHENTICATION.md) para más detalles.
