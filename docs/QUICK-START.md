# ⚡ Inicio Rápido

## 🚀 3 Pasos para Empezar

```bash
# 1. Base de datos
pnpm run docker:up && pnpm run prisma:push

# 2. Aplicación
pnpm run start:dev

# 3. Probar
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 🔐 Flujo de Autenticación

### 1. Registrarse
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123","name":"User"}'
```

### 2. Iniciar Sesión
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'
```

Guarda el `sessionToken` de la respuesta.

### 3. Crear Tarea (Protegido)
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi tarea"}'
```

### 4. Ver Mis Tareas (Protegido)
```bash
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer TU_TOKEN"
```

## 📌 Rutas Protegidas

**Todas estas requieren el header:** `Authorization: Bearer <token>`

- `GET /users/me` - Mi perfil
- `PATCH /users/me` - Actualizar perfil
- `GET /tasks` - Mis tareas
- `POST /tasks` - Crear tarea
- `PATCH /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

## 🎯 Siguiente Paso

Lee **[AUTHENTICATION.md](./AUTHENTICATION.md)** para entender todo el sistema en detalle.
