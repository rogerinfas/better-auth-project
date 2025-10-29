<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository con Prisma ORM, PostgreSQL y sistema completo de autenticación.

> 🚀 **¿Primera vez aquí?** Lee la [Guía de Inicio Rápido](./docs/QUICK-START.md) para comenzar en 5 minutos.

> 📋 **Resumen completo:** [RESUMEN-IMPLEMENTACION.md](./RESUMEN-IMPLEMENTACION.md) - Todo lo implementado

> 🔐 **Autenticación:** [docs/AUTHENTICATION.md](./docs/AUTHENTICATION.md) - Guía completa y detallada

## 🗄️ Stack Tecnológico

- **Framework:** NestJS
- **ORM:** Prisma
- **Base de datos:** PostgreSQL (Docker)
- **Autenticación:** Sistema personalizado con bcrypt y sesiones
- **Package Manager:** pnpm

## 🚀 Inicio Rápido

### 1. Instalación

```bash
$ pnpm install
```

### 2. Configurar Base de Datos

```bash
# Iniciar PostgreSQL con Docker (puerto 5435)
$ pnpm run docker:up

# Aplicar el esquema de Prisma
$ pnpm run prisma:push
```

### 3. Variables de Entorno

El archivo `.env` ya está configurado:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/better_auth_db?schema=public"
```

## 📦 Entidades y API

### 🔐 Autenticación

El proyecto incluye un sistema completo de autenticación:

- **Registro de usuarios** con email/password
- **Login** con sesiones persistentes
- **Protección de rutas** con Guards
- **Sesiones** que expiran en 30 días
- **Hashing seguro** de contraseñas con bcrypt

Endpoints de autenticación:
- `POST /auth/signup` - Registrar usuario
- `POST /auth/signin` - Iniciar sesión
- `GET /auth/me` - Usuario actual
- `POST /auth/signout` - Cerrar sesión

### 📊 Entidades de Negocio

El proyecto incluye dos entidades con CRUD completo:

- **User:** id, email, password, name, emailVerified, createdAt, tasks[]
  - Endpoints: `/users` (GET, POST, PATCH, DELETE)
  
- **Task:** id, title, description, completed, createdAt, updatedAt, userId
  - Endpoints: `/tasks` (GET, POST, PATCH, DELETE)

Ver más detalles:
- [AUTHENTICATION.md](./docs/AUTHENTICATION.md) - **📖 Guía completa de autenticación**
- [PRISMA-SETUP.md](./docs/PRISMA-SETUP.md) - Configuración de Prisma
- [API-ENDPOINTS.md](./docs/API-ENDPOINTS.md) - Documentación completa de la API

## 💻 Ejecutar el proyecto

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 🐳 Comandos Docker

```bash
# Iniciar base de datos
$ pnpm run docker:up

# Detener base de datos
$ pnpm run docker:down

# Ver logs
$ pnpm run docker:logs

# Reiniciar contenedor
$ pnpm run docker:restart
```

## 🗃️ Comandos Prisma

```bash
# Generar cliente Prisma
$ pnpm run prisma:generate

# Aplicar esquema (sin migraciones)
$ pnpm run prisma:push

# Crear y aplicar migración
$ pnpm run prisma:migrate

# Abrir Prisma Studio
$ pnpm run prisma:studio
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## 📚 Documentación

Este proyecto incluye documentación completa:

- **[QUICK-START.md](./docs/QUICK-START.md)** - Comienza en 5 minutos
- **[AUTHENTICATION.md](./docs/AUTHENTICATION.md)** - 🔐 Guía completa de autenticación
- **[API-ENDPOINTS.md](./docs/API-ENDPOINTS.md)** - Todos los endpoints con ejemplos
- **[PRISMA-SETUP.md](./docs/PRISMA-SETUP.md)** - Guía de Prisma
- **[DOCKER-SETUP.md](./docs/DOCKER-SETUP.md)** - Guía de Docker
- **[PROJECT-STRUCTURE.md](./docs/PROJECT-STRUCTURE.md)** - Arquitectura del proyecto
- **[api-test.http](./api-test.http)** - Tests de API (REST Client)

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
