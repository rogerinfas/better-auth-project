# ⚡ INICIO RÁPIDO

## 🚀 3 Comandos para Empezar

```bash
# 1. Iniciar base de datos
pnpm run docker:up && pnpm run prisma:push

# 2. Iniciar aplicación
pnpm run start:dev

# 3. Probar (en otra terminal)
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test"}'
```

✅ **Aplicación corriendo en:** http://localhost:3000

---

## 📚 Documentación

- **[RESUMEN-IMPLEMENTACION.md](./RESUMEN-IMPLEMENTACION.md)** - Resumen completo de todo
- **[docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md)** - Guía completa de autenticación
- **[docs/QUICK-START.md](./docs/QUICK-START.md)** - Guía detallada de inicio
- **[api-test.http](./api-test.http)** - Tests con REST Client

---

## 🔐 Endpoints de Autenticación

```
POST   /auth/signup      - Registrar usuario
POST   /auth/signin      - Iniciar sesión
GET    /auth/me          - Usuario actual (requiere token)
POST   /auth/signout     - Cerrar sesión (requiere token)
GET    /auth/check-email - Verificar si email existe
```

---

## 💻 Proteger Rutas (Ejemplo)

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@UseGuards(AuthGuard)  // Esta ruta requiere autenticación
@Get('protected')
async protectedRoute(@CurrentUser() user) {
  return { message: 'Autenticado', user: user.email };
}
```

---

## ✅ Lo que Tienes

- ✅ Autenticación completa con email/password
- ✅ Sesiones persistentes (30 días)
- ✅ Guards para proteger rutas
- ✅ Hashing seguro con bcrypt
- ✅ Base de datos con Docker
- ✅ Build exitoso
- ✅ Documentación completa
- ✅ Código comentado

---

**Lee [docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md) para todos los detalles** 📖

