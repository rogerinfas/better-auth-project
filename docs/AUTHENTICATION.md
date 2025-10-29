# 🔐 Documentación de Autenticación

## 📋 Índice

- [Introducción](#introducción)
- [¿Cómo Funciona?](#cómo-funciona)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Flujo de Autenticación](#flujo-de-autenticación)
- [Proteger Rutas](#proteger-rutas)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Seguridad](#seguridad)

---

## 📖 Introducción

Este proyecto implementa un sistema de autenticación robusto y seguro basado en:

- **Email y Contraseña**: Autenticación tradicional
- **Sesiones Persistentes**: Almacenadas en la base de datos
- **Bcrypt**: Para hashear contraseñas de forma segura
- **Tokens de Sesión**: Tokens únicos y seguros

### 🏗️ Arquitectura

```
Cliente
  ↓
POST /auth/signup (Registro)
  ↓
POST /auth/signin (Login) → Recibe sessionToken
  ↓
GET /tasks (con header: Authorization: Bearer <sessionToken>)
  ↓
AuthGuard verifica el token
  ↓
Si es válido, permite acceso
```

---

## 🔄 ¿Cómo Funciona?

### 1. **Registro (Sign Up)**

```
1. Usuario envía email y password
2. Sistema verifica que el email no exista
3. Password se hashea con bcrypt (10 rondas)
4. Usuario se guarda en la base de datos
5. Se retorna el usuario creado (sin password)
```

### 2. **Inicio de Sesión (Sign In)**

```
1. Usuario envía email y password
2. Sistema busca el usuario por email
3. Se compara el password con el hash almacenado
4. Si es correcto, se crea una sesión:
   - Se genera un token único (64 caracteres aleatorios)
   - Se calcula fecha de expiración (30 días)
   - Se guarda en la tabla Session
5. Se retorna el usuario y el sessionToken
```

### 3. **Verificación de Sesión**

```
1. Cliente envía sessionToken en header Authorization
2. AuthGuard intercepta el request
3. Se busca la sesión en la base de datos
4. Se verifica que no haya expirado
5. Si es válida, se agrega el usuario al request
6. El controlador recibe el request con user
```

---

## 🌐 Endpoints Disponibles

### 1. Registro de Usuario

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "miPassword123",
  "name": "Juan Pérez"  // opcional
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "image": null,
    "emailVerified": null,
    "createdAt": "2025-10-29T15:30:00.000Z",
    "updatedAt": "2025-10-29T15:30:00.000Z"
  },
  "message": "Usuario registrado exitosamente"
}
```

**Errores Posibles:**
- `400` - El email ya está registrado
- `500` - Error del servidor

---

### 2. Inicio de Sesión

```http
POST /auth/signin
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "miPassword123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "image": null,
    "emailVerified": null
  },
  "session": {
    "sessionToken": "aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789...",
    "expires": "2025-11-28T15:30:00.000Z"
  },
  "message": "Inicio de sesión exitoso"
}
```

⚠️ **IMPORTANTE**: Guarda el `sessionToken` en el cliente (localStorage, sessionStorage, etc.)

**Errores Posibles:**
- `401` - Credenciales inválidas
- `401` - Usuario debe usar OAuth
- `500` - Error del servidor

---

### 3. Obtener Usuario Actual

```http
GET /auth/me
Authorization: Bearer <sessionToken>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "image": null,
    "emailVerified": null,
    "createdAt": "2025-10-29T15:30:00.000Z",
    "updatedAt": "2025-10-29T15:30:00.000Z"
  },
  "session": {
    "sessionToken": "...",
    "expires": "2025-11-28T15:30:00.000Z"
  }
}
```

**Errores Posibles:**
- `401` - Token requerido
- `401` - Sesión inválida
- `401` - Sesión expirada

---

### 4. Cerrar Sesión

```http
POST /auth/signout
Authorization: Bearer <sessionToken>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### 5. Verificar Email

```http
GET /auth/check-email?email=usuario@example.com
```

**Respuesta:**
```json
{
  "exists": true,
  "email": "usuario@example.com"
}
```

Útil para validar en formularios de registro.

---

## 🔐 Proteger Rutas

### Usar el AuthGuard

El `AuthGuard` protege rutas que requieren autenticación.

**Ejemplo 1: Proteger un endpoint específico**

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tasks')
export class TasksController {
  // Esta ruta requiere autenticación
  @UseGuards(AuthGuard)
  @Get()
  async getTasks(@CurrentUser() user) {
    // user contiene la información del usuario autenticado
    console.log('Usuario autenticado:', user.email);
    return this.tasksService.findByUser(user.id);
  }

  // Esta ruta NO requiere autenticación
  @Get('public')
  async getPublicTasks() {
    return this.tasksService.findPublic();
  }
}
```

**Ejemplo 2: Proteger todo un controlador**

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

// Todas las rutas de este controlador requieren autenticación
@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  @Get()
  async getProfile(@CurrentUser() user) {
    return user;
  }

  @Get('settings')
  async getSettings(@CurrentUser() user) {
    return this.settingsService.findByUser(user.id);
  }
}
```

---

## 💡 Ejemplos de Uso

### Frontend con Fetch (Vanilla JS)

```javascript
// 1. Registro
async function signUp(email, password, name) {
  const response = await fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  const data = await response.json();
  return data;
}

// 2. Login
async function signIn(email, password) {
  const response = await fetch('http://localhost:3000/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  // Guardar el token en localStorage
  if (data.success) {
    localStorage.setItem('sessionToken', data.session.sessionToken);
  }
  
  return data;
}

// 3. Hacer request autenticado
async function getTasks() {
  const token = localStorage.getItem('sessionToken');
  
  const response = await fetch('http://localhost:3000/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
}

// 4. Logout
async function signOut() {
  const token = localStorage.getItem('sessionToken');
  
  await fetch('http://localhost:3000/auth/signout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  localStorage.removeItem('sessionToken');
}
```

### Con cURL

```bash
# 1. Registro
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# 2. Login (guarda el sessionToken)
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# 3. Usar el token en requests
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer TU_SESSION_TOKEN_AQUI"

# 4. Obtener usuario actual
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer TU_SESSION_TOKEN_AQUI"

# 5. Logout
curl -X POST http://localhost:3000/auth/signout \
  -H "Authorization: Bearer TU_SESSION_TOKEN_AQUI"
```

---

## 🔒 Seguridad

### ✅ Implementado

1. **Hashing de Contraseñas**
   - Bcrypt con 10 rondas de salt
   - Las contraseñas nunca se almacenan en texto plano
   - Las contraseñas nunca se retornan en responses

2. **Sesiones Seguras**
   - Tokens aleatorios de 64 caracteres
   - Almacenados en la base de datos
   - Expiración automática después de 30 días
   - Eliminación de sesiones expiradas

3. **Validación**
   - Email único
   - Longitud mínima de contraseña: 6 caracteres
   - Verificación de sesión en cada request protegido

### ⚠️ Recomendaciones para Producción

1. **Variables de Entorno**
   ```env
   AUTH_SECRET="genera-un-secret-aleatorio-de-minimo-32-caracteres"
   ```
   Usa un generador de secrets: `openssl rand -base64 32`

2. **HTTPS**
   - SIEMPRE usa HTTPS en producción
   - Los tokens se envían en headers y deben estar encriptados

3. **CORS**
   - Configura CORS apropiadamente
   - Solo permite orígenes confiables

4. **Rate Limiting**
   - Limita intentos de login
   - Previene ataques de fuerza bruta

5. **Validación de Inputs**
   - Instala `class-validator` y `class-transformer`
   - Valida todos los DTOs

6. **Logs y Monitoreo**
   - Registra intentos de login fallidos
   - Monitorea actividad sospechosa

7. **Limpieza de Sesiones**
   - Ejecuta periódicamente `cleanExpiredSessions()`
   - Usa un cron job o scheduler de NestJS

---

## 📚 Estructura de la Base de Datos

### Tabla: User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| email | String | Email único del usuario |
| password | String? | Contraseña hasheada (null para OAuth) |
| name | String? | Nombre del usuario |
| image | String? | URL de imagen de perfil |
| emailVerified | DateTime? | Fecha de verificación del email |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Fecha de última actualización |

### Tabla: Session

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| sessionToken | String | Token único de sesión |
| userId | UUID | ID del usuario |
| expires | DateTime | Fecha de expiración |
| createdAt | DateTime | Fecha de creación |
| updatedAt | DateTime | Fecha de última actualización |

---

## 🐛 Troubleshooting

### "Token de sesión requerido"
- Verifica que estás enviando el header `Authorization: Bearer <token>`
- Verifica que el token es correcto

### "Sesión inválida o expirada"
- La sesión expiró (30 días)
- El token es incorrecto
- Haz login nuevamente

### "Credenciales inválidas"
- Email o contraseña incorrectos
- Verifica que el usuario existe

### "El email ya está registrado"
- Usa otro email o inicia sesión con el existente

---

## 🎯 Próximos Pasos

Funcionalidades que podrías agregar:

1. **Verificación de Email**
   - Enviar email con token de verificación
   - Endpoint para verificar el token

2. **Reset de Contraseña**
   - Endpoint para solicitar reset
   - Enviar email con token
   - Endpoint para cambiar contraseña

3. **OAuth (Google, GitHub, etc.)**
   - Integrar proveedores OAuth
   - Usar la tabla Account

4. **Refresh Tokens**
   - Tokens de larga duración
   - Renovar sesiones automáticamente

5. **Two-Factor Authentication (2FA)**
   - TOTP con Google Authenticator
   - SMS o email

6. **Roles y Permisos**
   - Sistema de roles (admin, user, etc.)
   - Guards basados en roles

