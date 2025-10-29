# 📡 Documentación de API - Endpoints CRUD

## 🔐 Users (Usuarios)

### Base URL: `/users`

#### 1. Crear Usuario
```http
POST /users
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "miPassword123"
}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "password": "miPassword123",
  "createdAt": "2025-10-29T...",
  "tasks": []
}
```

#### 2. Obtener Todos los Usuarios
```http
GET /users
```

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "email": "usuario@example.com",
    "password": "miPassword123",
    "createdAt": "2025-10-29T...",
    "tasks": [...]
  }
]
```

#### 3. Obtener Usuario por ID
```http
GET /users/:id
```

**Ejemplo:** `GET /users/550e8400-e29b-41d4-a716-446655440000`

#### 4. Obtener Usuario por Email
```http
GET /users/by-email?email=usuario@example.com
```

#### 5. Actualizar Usuario
```http
PATCH /users/:id
Content-Type: application/json

{
  "email": "nuevo-email@example.com",
  "password": "nuevoPassword"
}
```

#### 6. Eliminar Usuario
```http
DELETE /users/:id
```

**Nota:** Al eliminar un usuario, todas sus tareas se eliminan automáticamente (onDelete: Cascade).

---

## ✅ Tasks (Tareas)

### Base URL: `/tasks`

#### 1. Crear Tarea
```http
POST /tasks
Content-Type: application/json

{
  "title": "Mi primera tarea",
  "description": "Descripción de la tarea",
  "userId": "uuid-del-usuario"
}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "title": "Mi primera tarea",
  "description": "Descripción de la tarea",
  "completed": false,
  "createdAt": "2025-10-29T...",
  "updatedAt": "2025-10-29T...",
  "userId": "uuid-del-usuario",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@example.com",
    ...
  }
}
```

#### 2. Obtener Todas las Tareas
```http
GET /tasks
```

#### 3. Obtener Tareas por Usuario
```http
GET /tasks?userId=uuid-del-usuario
```

#### 4. Obtener Tarea por ID
```http
GET /tasks/:id
```

#### 5. Actualizar Tarea
```http
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "completed": true
}
```

#### 6. Alternar Estado Completado
```http
PATCH /tasks/:id/toggle
```

Este endpoint cambia el estado `completed` de `true` a `false` o viceversa.

#### 7. Eliminar Tarea
```http
DELETE /tasks/:id
```

---

## 🧪 Ejemplos con cURL

### Crear un usuario:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'
```

### Crear una tarea:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan","description":"En la panadería de la esquina","userId":"UUID-DEL-USUARIO"}'
```

### Obtener todos los usuarios:
```bash
curl http://localhost:3000/users
```

### Obtener tareas de un usuario:
```bash
curl "http://localhost:3000/tasks?userId=UUID-DEL-USUARIO"
```

### Actualizar una tarea:
```bash
curl -X PATCH http://localhost:3000/tasks/UUID-DE-LA-TAREA \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Alternar estado de tarea:
```bash
curl -X PATCH http://localhost:3000/tasks/UUID-DE-LA-TAREA/toggle
```

### Eliminar una tarea:
```bash
curl -X DELETE http://localhost:3000/tasks/UUID-DE-LA-TAREA
```

---

## 🚀 Flujo de Trabajo Recomendado

1. **Iniciar la base de datos:**
   ```bash
   pnpm run docker:up
   pnpm run prisma:push
   ```

2. **Iniciar el servidor:**
   ```bash
   pnpm run start:dev
   ```

3. **Crear un usuario:**
   ```bash
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"123456"}'
   ```

4. **Copiar el `id` del usuario de la respuesta**

5. **Crear tareas para ese usuario:**
   ```bash
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Mi tarea","userId":"ID-COPIADO"}'
   ```

6. **Ver todas las tareas del usuario:**
   ```bash
   curl "http://localhost:3000/tasks?userId=ID-COPIADO"
   ```

---

## 🛠️ Herramientas Recomendadas

- **Postman**: Para probar APIs de forma visual
- **Insomnia**: Alternativa a Postman
- **Thunder Client**: Extensión de VS Code
- **cURL**: Desde la terminal (ejemplos arriba)
- **Prisma Studio**: `pnpm run prisma:studio` para ver los datos en la BD

---

## ⚠️ Manejo de Errores

### 404 Not Found
Cuando un recurso no existe:
```json
{
  "statusCode": 404,
  "message": "Usuario con ID xxx no encontrado",
  "error": "Not Found"
}
```

### 500 Internal Server Error
Errores de base de datos o del servidor:
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

