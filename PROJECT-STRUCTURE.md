# 📁 Estructura del Proyecto

## 🗂️ Arquitectura

```
better-auth-project/
│
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos con User y Task
│   └── migrations/            # Migraciones de la base de datos
│
├── src/
│   ├── users/                 # Módulo de Usuarios
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── users.controller.ts    # Controlador REST de usuarios
│   │   ├── users.service.ts       # Lógica de negocio de usuarios
│   │   └── users.module.ts        # Módulo de usuarios
│   │
│   ├── tasks/                 # Módulo de Tareas
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── tasks.controller.ts    # Controlador REST de tareas
│   │   ├── tasks.service.ts       # Lógica de negocio de tareas
│   │   └── tasks.module.ts        # Módulo de tareas
│   │
│   ├── prisma.service.ts      # Servicio de Prisma (conexión a BD)
│   ├── prisma.module.ts       # Módulo global de Prisma
│   ├── app.module.ts          # Módulo principal de la aplicación
│   └── main.ts                # Punto de entrada de la aplicación
│
├── generated/
│   └── prisma/                # Cliente de Prisma generado
│
├── docker-compose.yml         # Configuración de PostgreSQL
├── prisma.config.ts           # Configuración de Prisma
├── .env                       # Variables de entorno
├── api-test.http              # Tests de API (REST Client)
│
└── Documentación/
    ├── README.md              # Documentación principal
    ├── PRISMA-SETUP.md        # Guía de Prisma
    ├── DOCKER-SETUP.md        # Guía de Docker
    ├── API-ENDPOINTS.md       # Documentación de API
    └── PROJECT-STRUCTURE.md   # Este archivo
```

## 🏗️ Módulos

### 1. PrismaModule (Global)
- **Propósito:** Provee el servicio de Prisma a toda la aplicación
- **Exporta:** `PrismaService`
- **Scope:** Global (`@Global()`)

### 2. UsersModule
- **Ruta base:** `/users`
- **Controlador:** `UsersController`
- **Servicio:** `UsersService`
- **Operaciones:** CRUD completo de usuarios

### 3. TasksModule
- **Ruta base:** `/tasks`
- **Controlador:** `TasksController`
- **Servicio:** `TasksService`
- **Operaciones:** CRUD completo de tareas

## 🔄 Flujo de Datos

```
Cliente (HTTP Request)
    ↓
Controller (users.controller.ts / tasks.controller.ts)
    ↓
Service (users.service.ts / tasks.service.ts)
    ↓
PrismaService (prisma.service.ts)
    ↓
Base de Datos (PostgreSQL)
```

## 📊 Modelo de Datos

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │      Task       │
├─────────────────┤         ├─────────────────┤
│ id: String      │─────┐   │ id: String      │
│ email: String   │     │   │ title: String   │
│ password: String│     │   │ description?    │
│ createdAt: Date │     └──<│ userId: String  │
│ tasks: Task[]   │         │ completed: Bool │
└─────────────────┘         │ createdAt: Date │
                            │ updatedAt: Date │
                            └─────────────────┘
```

## 🎯 Endpoints Disponibles

### Users
```
POST   /users              # Crear usuario
GET    /users              # Listar usuarios
GET    /users/:id          # Obtener usuario
GET    /users/by-email     # Buscar por email
PATCH  /users/:id          # Actualizar usuario
DELETE /users/:id          # Eliminar usuario
```

### Tasks
```
POST   /tasks              # Crear tarea
GET    /tasks              # Listar tareas
GET    /tasks?userId=...   # Filtrar por usuario
GET    /tasks/:id          # Obtener tarea
PATCH  /tasks/:id          # Actualizar tarea
PATCH  /tasks/:id/toggle   # Alternar completado
DELETE /tasks/:id          # Eliminar tarea
```

## 🔧 Tecnologías Usadas

- **Framework:** NestJS 11
- **ORM:** Prisma 6.18
- **Base de Datos:** PostgreSQL 16 (Docker)
- **Lenguaje:** TypeScript 5.7
- **Package Manager:** pnpm
- **Runtime:** Node.js

## 🚀 Scripts Disponibles

### Desarrollo
```bash
pnpm run start:dev         # Modo desarrollo con watch
pnpm run start             # Modo desarrollo
pnpm run build             # Compilar producción
pnpm run start:prod        # Ejecutar producción
```

### Docker
```bash
pnpm run docker:up         # Iniciar PostgreSQL
pnpm run docker:down       # Detener PostgreSQL
pnpm run docker:logs       # Ver logs
pnpm run docker:restart    # Reiniciar contenedor
```

### Prisma
```bash
pnpm run prisma:generate   # Generar cliente
pnpm run prisma:push       # Sincronizar esquema
pnpm run prisma:migrate    # Crear migración
pnpm run prisma:studio     # Abrir Prisma Studio
```

### Testing
```bash
pnpm run test              # Tests unitarios
pnpm run test:watch        # Tests en modo watch
pnpm run test:cov          # Coverage
pnpm run test:e2e          # Tests e2e
```

## 📝 Convenciones

### Nombres de Archivos
- **DTOs:** `create-*.dto.ts`, `update-*.dto.ts`
- **Servicios:** `*.service.ts`
- **Controladores:** `*.controller.ts`
- **Módulos:** `*.module.ts`

### Estructura de Carpetas
- Cada entidad tiene su propia carpeta en `/src`
- Los DTOs están en subcarpeta `/dto`
- Un módulo por funcionalidad

### Respuestas de API
- Todos los endpoints incluyen las relaciones
- Las fechas están en formato ISO 8601
- Los IDs son UUIDs (v4)

## 🔐 Seguridad

⚠️ **IMPORTANTE:** Este proyecto es un ejemplo de aprendizaje. Para producción:
- Hashear las contraseñas (bcrypt)
- Implementar autenticación JWT
- Validar DTOs con class-validator
- Implementar rate limiting
- Sanitizar inputs
- Usar variables de entorno seguras

