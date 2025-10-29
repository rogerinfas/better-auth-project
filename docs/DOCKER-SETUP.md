# 🐳 Configuración de Docker

Este proyecto incluye un `docker-compose.yml` para ejecutar PostgreSQL en un contenedor Docker.

## 📋 Configuración

### PostgreSQL
- **Puerto:** 5435 (host) → 5432 (contenedor)
- **Usuario:** postgres
- **Contraseña:** postgres
- **Base de datos:** better_auth_db

## 🚀 Comandos

### Iniciar la base de datos
```bash
docker-compose up -d
```

### Ver los logs
```bash
docker-compose logs -f postgres
```

### Detener la base de datos
```bash
docker-compose down
```

### Detener y eliminar volúmenes (borra todos los datos)
```bash
docker-compose down -v
```

### Ver el estado de los contenedores
```bash
docker-compose ps
```

## 🔄 Workflow Completo

1. **Iniciar la base de datos:**
   ```bash
   docker-compose up -d
   ```

2. **Aplicar el esquema de Prisma:**
   ```bash
   pnpm run prisma:push
   ```
   
   O crear una migración:
   ```bash
   pnpm run prisma:migrate
   ```

3. **Verificar que todo funciona:**
   ```bash
   pnpm run prisma:studio
   ```
   Esto abrirá Prisma Studio en tu navegador donde podrás ver las tablas.

4. **Iniciar la aplicación:**
   ```bash
   pnpm run start:dev
   ```

## 🔧 Conexión a la Base de Datos

La URL de conexión está configurada en `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/better_auth_db?schema=public"
```

### Conectarse directamente con psql
```bash
psql -h localhost -p 5435 -U postgres -d better_auth_db
```
(Contraseña: postgres)

### Conectarse con un cliente GUI
- **Host:** localhost
- **Puerto:** 5435
- **Usuario:** postgres
- **Contraseña:** postgres
- **Base de datos:** better_auth_db

## 📦 Volúmenes

Los datos de PostgreSQL se persisten en un volumen de Docker llamado `postgres_data`. Esto significa que los datos se mantendrán aunque detengas el contenedor.

## 🔍 Troubleshooting

### El puerto 5435 está en uso
Si el puerto 5435 ya está en uso, puedes cambiarlo en el `docker-compose.yml`:
```yaml
ports:
  - "NUEVO_PUERTO:5432"
```

Y actualizar el `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:NUEVO_PUERTO/better_auth_db?schema=public"
```

### Error de conexión
Verifica que el contenedor esté corriendo:
```bash
docker-compose ps
```

Verifica los logs:
```bash
docker-compose logs postgres
```

### Limpiar todo y empezar de nuevo
```bash
docker-compose down -v
docker-compose up -d
pnpm run prisma:push
```

