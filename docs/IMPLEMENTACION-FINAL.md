# ✅ Implementación Final - Sistema de Autenticación

## 🎯 Resumen

Sistema completo de autenticación con **todas las rutas protegidas** implementado con NestJS, Prisma y PostgreSQL.

---

## 📊 Diagramas de Secuencia

### 1️⃣ Flujo de Registro (Sign Up)

```
┌─────────┐           ┌──────────────┐           ┌─────────────┐           ┌──────────┐
│ Cliente │           │ AuthController│           │ AuthService │           │ Database │
└────┬────┘           └───────┬──────┘           └──────┬──────┘           └────┬─────┘
     │                        │                          │                       │
     │ POST /auth/signup      │                          │                       │
     │ {email, password}      │                          │                       │
     ├───────────────────────>│                          │                       │
     │                        │                          │                       │
     │                        │ signUp(email, password)  │                       │
     │                        ├─────────────────────────>│                       │
     │                        │                          │                       │
     │                        │                          │ Verificar email único │
     │                        │                          ├──────────────────────>│
     │                        │                          │                       │
     │                        │                          │<──────────────────────┤
     │                        │                          │ email disponible      │
     │                        │                          │                       │
     │                        │                          │ Hashear password      │
     │                        │                          │ (bcrypt 10 rondas)    │
     │                        │                          │                       │
     │                        │                          │ Crear usuario         │
     │                        │                          ├──────────────────────>│
     │                        │                          │                       │
     │                        │                          │<──────────────────────┤
     │                        │                          │ Usuario creado        │
     │                        │                          │                       │
     │                        │<─────────────────────────┤                       │
     │                        │ Usuario (sin password)   │                       │
     │                        │                          │                       │
     │<───────────────────────┤                          │                       │
     │ 201 Created            │                          │                       │
     │ {user: {id, email}}    │                          │                       │
     │                        │                          │                       │
```

### 2️⃣ Flujo de Inicio de Sesión (Sign In)

```
┌─────────┐           ┌──────────────┐           ┌─────────────┐           ┌──────────┐
│ Cliente │           │ AuthController│           │ AuthService │           │ Database │
└────┬────┘           └───────┬──────┘           └──────┬──────┘           └────┬─────┘
     │                        │                          │                       │
     │ POST /auth/signin      │                          │                       │
     │ {email, password}      │                          │                       │
     ├───────────────────────>│                          │                       │
     │                        │                          │                       │
     │                        │ signIn(email, password)  │                       │
     │                        ├─────────────────────────>│                       │
     │                        │                          │                       │
     │                        │                          │ Buscar usuario        │
     │                        │                          ├──────────────────────>│
     │                        │                          │                       │
     │                        │                          │<──────────────────────┤
     │                        │                          │ Usuario encontrado    │
     │                        │                          │                       │
     │                        │                          │ Comparar password     │
     │                        │                          │ bcrypt.compare()      │
     │                        │                          │                       │
     │                        │                          │ ✓ Password válido     │
     │                        │                          │                       │
     │                        │                          │ Generar sessionToken  │
     │                        │                          │ (64 chars aleatorios) │
     │                        │                          │                       │
     │                        │                          │ Crear sesión          │
     │                        │                          │ expires = now + 30d   │
     │                        │                          ├──────────────────────>│
     │                        │                          │                       │
     │                        │                          │<──────────────────────┤
     │                        │                          │ Sesión creada         │
     │                        │                          │                       │
     │                        │<─────────────────────────┤                       │
     │                        │ {user, sessionToken}     │                       │
     │                        │                          │                       │
     │<───────────────────────┤                          │                       │
     │ 200 OK                 │                          │                       │
     │ {                      │                          │                       │
     │   user: {...},         │                          │                       │
     │   session: {           │                          │                       │
     │     sessionToken: "abc"│                          │                       │
     │   }                    │                          │                       │
     │ }                      │                          │                       │
     │                        │                          │                       │
     │ 💾 Guardar token       │                          │                       │
     │ localStorage.setItem() │                          │                       │
     │                        │                          │                       │
```

### 3️⃣ Flujo de Acceso a Recurso Protegido

```
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌─────────────┐     ┌──────────┐
│ Cliente │     │TasksController│     │ AuthGuard │     │ AuthService │     │ Database │
└────┬────┘     └───────┬──────┘     └─────┬─────┘     └──────┬──────┘     └────┬─────┘
     │                  │                   │                  │                  │
     │ GET /tasks       │                   │                  │                  │
     │ Authorization:   │                   │                  │                  │
     │ Bearer <token>   │                   │                  │                  │
     ├─────────────────>│                   │                  │                  │
     │                  │                   │                  │                  │
     │                  │ canActivate()     │                  │                  │
     │                  ├──────────────────>│                  │                  │
     │                  │                   │                  │                  │
     │                  │                   │ Extraer token    │                  │
     │                  │                   │ del header       │                  │
     │                  │                   │                  │                  │
     │                  │                   │ getUserBySession │                  │
     │                  │                   ├─────────────────>│                  │
     │                  │                   │                  │                  │
     │                  │                   │                  │ Buscar sesión    │
     │                  │                   │                  ├─────────────────>│
     │                  │                   │                  │                  │
     │                  │                   │                  │<─────────────────┤
     │                  │                   │                  │ Sesión encontrada│
     │                  │                   │                  │                  │
     │                  │                   │                  │ Verificar expires│
     │                  │                   │                  │ expires > now?   │
     │                  │                   │                  │ ✓ Válida         │
     │                  │                   │                  │                  │
     │                  │                   │<─────────────────┤                  │
     │                  │                   │ {user, session}  │                  │
     │                  │                   │                  │                  │
     │                  │<──────────────────┤                  │                  │
     │                  │ true              │                  │                  │
     │                  │ request.user = {} │                  │                  │
     │                  │                   │                  │                  │
     │                  │ findAll(@CurrentUser() user)         │                  │
     │                  │                                      │                  │
     │                  │ tasksService.findByUserId(user.id)   │                  │
     │                  │                                      │                  │
     │                  │                                      │ SELECT * FROM    │
     │                  │                                      │ tasks WHERE      │
     │                  │                                      │ userId = user.id │
     │                  │                                      ├─────────────────>│
     │                  │                                      │                  │
     │                  │                                      │<─────────────────┤
     │                  │                                      │ Tareas del user  │
     │                  │                                      │                  │
     │<─────────────────┤                                      │                  │
     │ 200 OK           │                                      │                  │
     │ [{id, title...}] │                                      │                  │
     │                  │                                      │                  │
```

### 4️⃣ Flujo de Acceso Denegado (Sin Token o Token Inválido)

```
┌─────────┐     ┌──────────────┐     ┌───────────┐     ┌─────────────┐
│ Cliente │     │TasksController│     │ AuthGuard │     │ AuthService │
└────┬────┘     └───────┬──────┘     └─────┬─────┘     └──────┬──────┘
     │                  │                   │                  │
     │ GET /tasks       │                   │                  │
     │ (sin token)      │                   │                  │
     ├─────────────────>│                   │                  │
     │                  │                   │                  │
     │                  │ canActivate()     │                  │
     │                  ├──────────────────>│                  │
     │                  │                   │                  │
     │                  │                   │ ❌ No hay token  │
     │                  │                   │                  │
     │                  │<──────────────────┤                  │
     │                  │ UnauthorizedException                │
     │                  │                   │                  │
     │<─────────────────┤                   │                  │
     │ 401 Unauthorized │                   │                  │
     │ {               │                   │                  │
     │   statusCode: 401│                   │                  │
     │   message: "Token│                   │                  │
     │   requerido"     │                   │                  │
     │ }               │                   │                  │
     │                  │                   │                  │

─── O si el token es inválido ───

     │ GET /tasks       │                   │                  │
     │ Bearer xyz123    │                   │                  │
     ├─────────────────>│                   │                  │
     │                  │                   │                  │
     │                  │ canActivate()     │                  │
     │                  ├──────────────────>│                  │
     │                  │                   │                  │
     │                  │                   │ getUserBySession │
     │                  │                   ├─────────────────>│
     │                  │                   │                  │
     │                  │                   │ ❌ Sesión no     │
     │                  │                   │    encontrada    │
     │                  │                   │                  │
     │                  │<──────────────────┤                  │
     │                  │ UnauthorizedException                │
     │                  │                   │                  │
     │<─────────────────┤                   │                  │
     │ 401 Unauthorized │                   │                  │
     │ "Sesión inválida"│                   │                  │
```

---

## 🔐 Cómo Funciona la Autenticación

### Componentes Principales

1. **AuthService** (`auth.service.ts`)
   - Maneja toda la lógica de autenticación
   - Hash de contraseñas con bcrypt
   - Creación y validación de sesiones
   - Generación de tokens únicos

2. **AuthGuard** (`guards/auth.guard.ts`)
   - Intercepta requests antes de llegar al controlador
   - Verifica la presencia del token
   - Valida la sesión
   - Agrega el usuario al request

3. **@CurrentUser()** Decorador
   - Extrae el usuario del request
   - Disponible en controladores protegidos
   - Type-safe con TypeScript

4. **Sesiones en Base de Datos**
   - Tabla `Session` con token único
   - Relacionada con `User`
   - Expiración automática después de 30 días

### Flujo de Datos

```
1. Usuario registra → Password hasheado → Guardado en DB

2. Usuario hace login → Valida password → Crea sesión → Retorna token

3. Cliente guarda token → localStorage/cookie

4. Request a ruta protegida → Header: Authorization: Bearer <token>

5. AuthGuard intercepta → Verifica token → Busca sesión en DB

6. Si válida → Agrega user a request → Permite acceso

7. Controlador usa @CurrentUser() → Obtiene usuario autenticado

8. Servicio filtra por userId → Solo datos del usuario
```

---

## 📋 Endpoints

### 🔓 Públicos (No requieren autenticación)

```
POST /auth/signup        - Registrar usuario
POST /auth/signin        - Iniciar sesión
GET  /auth/check-email   - Verificar si email existe
```

### 🔒 Protegidos (Requieren token en header)

**Autenticación:**
```
GET  /auth/me            - Usuario actual
POST /auth/signout       - Cerrar sesión
```

**Perfil del Usuario:**
```
GET    /users/me         - Ver mi perfil
PATCH  /users/me         - Actualizar mi perfil
DELETE /users/me         - Eliminar mi cuenta
```

**Tareas del Usuario:**
```
POST   /tasks            - Crear mi tarea
GET    /tasks            - Ver mis tareas
GET    /tasks/:id        - Ver mi tarea específica
PATCH  /tasks/:id        - Actualizar mi tarea
PATCH  /tasks/:id/toggle - Alternar estado de mi tarea
DELETE /tasks/:id        - Eliminar mi tarea
```

---

## 🛡️ Seguridad Implementada

### ✅ Hash de Contraseñas

```typescript
// En signUp
const hashedPassword = await bcrypt.hash(password, 10);
// 10 rondas de salt = muy seguro

// En signIn
const isValid = await bcrypt.compare(password, user.password);
// Compara de forma segura
```

### ✅ Tokens Únicos

```typescript
// Generación de token
private generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
// 64 caracteres aleatorios = 62^64 combinaciones posibles
```

### ✅ Expiración Automática

```typescript
// Al crear sesión
const expires = new Date();
expires.setDate(expires.getDate() + 30); // 30 días

// Al verificar
if (session.expires < new Date()) {
  throw new UnauthorizedException('Sesión expirada');
}
```

### ✅ Filtrado por Usuario

```typescript
// Todas las consultas filtran por userId
async findAll(@CurrentUser() user: any) {
  return this.tasksService.findByUserId(user.id);
}

// En el servicio
async findByUserId(userId: string) {
  return this.prisma.task.findMany({
    where: { userId }, // Solo tareas del usuario
  });
}
```

---

## 💻 Ejemplo de Implementación Frontend

### React con Hooks

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verificando auth:', error);
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.session.sessionToken);
      setUser(data.user);
      return { success: true };
    }
    
    return { success: false, error: 'Credenciales inválidas' };
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3000/auth/signout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout, checkAuth };
}

// Usar en componente
function App() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return user ? (
    <Dashboard user={user} onLogout={logout} />
  ) : (
    <LoginForm onLogin={login} />
  );
}
```

### API Helper

```javascript
// utils/api.js
const API_URL = 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');

export const api = {
  // Helper para requests autenticados
  async fetch(endpoint, options = {}) {
    const token = getToken();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token inválido, limpiar y redirigir
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('No autorizado');
    }

    return response;
  },

  // Tareas
  async getTasks() {
    const response = await this.fetch('/tasks');
    return response.json();
  },

  async createTask(task) {
    const response = await this.fetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    return response.json();
  },

  async updateTask(id, updates) {
    const response = await this.fetch(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  async deleteTask(id) {
    await this.fetch(`/tasks/${id}`, { method: 'DELETE' });
  },
};
```

---

## 🔧 Estructura del Código

```
src/
├── auth/                          # Sistema de autenticación
│   ├── auth.config.ts            # ⚙️ Configuración
│   ├── auth.service.ts           # 🔐 Lógica de autenticación
│   ├── auth.controller.ts        # 🌐 Endpoints públicos
│   ├── auth.module.ts            # 📦 Módulo
│   ├── guards/
│   │   └── auth.guard.ts         # 🔒 Protector de rutas
│   └── decorators/
│       └── current-user.decorator.ts  # 👤 Decorador de usuario
│
├── users/                         # Gestión de usuarios
│   ├── users.controller.ts       # 🔒 PROTEGIDO
│   ├── users.service.ts
│   └── users.module.ts           # ✅ Importa AuthModule
│
└── tasks/                         # Gestión de tareas
    ├── tasks.controller.ts        # 🔒 PROTEGIDO
    ├── tasks.service.ts
    └── tasks.module.ts           # ✅ Importa AuthModule
```

---

## ✅ Validaciones Implementadas

1. **Autenticación Requerida**
   - Sin token → 401 Unauthorized
   - Token inválido → 401 Unauthorized
   - Token expirado → 401 Unauthorized

2. **Propiedad de Recursos**
   - Intentar acceder a tarea de otro usuario → 404 Not Found
   - Solo se puede crear/ver/modificar propios recursos

3. **Datos Sensibles**
   - Contraseñas hasheadas con bcrypt
   - Contraseñas nunca en responses
   - Sesiones validadas en cada request

---

## 🚀 Para Probar

```bash
# 1. Iniciar todo
pnpm run docker:up
pnpm run prisma:push
pnpm run start:dev

# 2. Registrar usuario
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}'

# 3. Login (copiar el token)
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# 4. Intentar acceder sin token (debería fallar)
curl http://localhost:3000/tasks

# 5. Acceder con token (debería funcionar)
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

**¡Sistema completamente protegido y funcional!** 🎉

Lee **[AUTHENTICATION.md](./AUTHENTICATION.md)** para más detalles.
