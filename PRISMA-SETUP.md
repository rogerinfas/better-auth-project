# Configuración de Prisma

Este proyecto tiene configurado Prisma con dos entidades: **User** y **Task**.

## 📋 Entidades Creadas

### User
- `id`: String (UUID)
- `email`: String (único)
- `password`: String
- `createdAt`: DateTime
- `tasks`: Relación uno a muchos con Task[]

### Task
- `id`: String (UUID)
- `title`: String
- `description`: String (opcional)
- `completed`: Boolean (por defecto false)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `userId`: String (clave foránea)
- `user`: Relación con User

## 🚀 Comandos Disponibles

```bash
# Generar el cliente de Prisma
pnpm run prisma:generate

# Crear y aplicar migraciones
pnpm run prisma:migrate

# Sincronizar el esquema con la base de datos (sin migraciones)
pnpm run prisma:push

# Abrir Prisma Studio (interfaz gráfica para ver/editar datos)
pnpm run prisma:studio
```

## 📝 Uso en el Código

El proyecto incluye:
- `PrismaService`: Servicio global de Prisma
- `PrismaModule`: Módulo global que exporta PrismaService
- `example-usage.ts`: Ejemplos de uso de las entidades

### Ejemplo de Uso

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class MiServicio {
  constructor(private prisma: PrismaService) {}

  async crearUsuario(email: string, password: string) {
    return this.prisma.user.create({
      data: { email, password },
    });
  }

  async crearTarea(userId: string, title: string) {
    return this.prisma.task.create({
      data: {
        title,
        userId,
      },
    });
  }

  async obtenerUsuariosConTareas() {
    return this.prisma.user.findMany({
      include: { tasks: true },
    });
  }
}
```

## 🗄️ Base de Datos

El proyecto está configurado con PostgreSQL. La URL de conexión está en el archivo `.env`:

```
DATABASE_URL="prisma+postgres://..."
```

## 🔄 Próximos Pasos

1. Ejecutar las migraciones:
   ```bash
   pnpm run prisma:migrate
   ```

2. (Opcional) Abrir Prisma Studio para ver la base de datos:
   ```bash
   pnpm run prisma:studio
   ```

3. Usar las entidades en tus controladores y servicios

## 📚 Documentación

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de Prisma con NestJS](https://docs.nestjs.com/recipes/prisma)

