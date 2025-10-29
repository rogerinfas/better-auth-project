/**
 * ============================================
 * CONTROLADOR DE AUTENTICACIÓN
 * ============================================
 * 
 * Este controlador expone los endpoints REST para autenticación:
 * - POST /auth/signup - Registrar nuevo usuario
 * - POST /auth/signin - Iniciar sesión
 * - POST /auth/signout - Cerrar sesión
 * - GET /auth/me - Obtener usuario actual
 * - GET /auth/check-email - Verificar si un email existe
 * 
 * Todos los endpoints están documentados con comentarios
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * ENDPOINT: Registrar nuevo usuario
   * 
   * POST /auth/signup
   * 
   * Crea una nueva cuenta de usuario con email y contraseña.
   * La contraseña se hashea automáticamente.
   * 
   * Body:
   * {
   *   "email": "usuario@example.com",
   *   "password": "miPassword123",
   *   "name": "Juan Pérez" (opcional)
   * }
   * 
   * Respuesta exitosa (201):
   * {
   *   "success": true,
   *   "user": {
   *     "id": "uuid",
   *     "email": "usuario@example.com",
   *     "name": "Juan Pérez",
   *     ...
   *   },
   *   "message": "Usuario registrado exitosamente"
   * }
   */
  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
    );
  }

  /**
   * ENDPOINT: Iniciar sesión
   * 
   * POST /auth/signin
   * 
   * Autentica a un usuario y crea una sesión.
   * Retorna el usuario y un token de sesión.
   * 
   * Body:
   * {
   *   "email": "usuario@example.com",
   *   "password": "miPassword123"
   * }
   * 
   * Respuesta exitosa (200):
   * {
   *   "success": true,
   *   "user": {
   *     "id": "uuid",
   *     "email": "usuario@example.com",
   *     ...
   *   },
   *   "session": {
   *     "sessionToken": "token-aleatorio-seguro",
   *     "expires": "2025-11-28T..."
   *   },
   *   "message": "Inicio de sesión exitoso"
   * }
   * 
   * El sessionToken debe guardarse en el cliente (localStorage, cookie, etc.)
   * y enviarse en el header Authorization de requests posteriores.
   */
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  /**
   * ENDPOINT: Cerrar sesión
   * 
   * POST /auth/signout
   * 
   * Elimina la sesión actual del usuario.
   * Requiere el token de sesión en el header Authorization.
   * 
   * Headers:
   * Authorization: Bearer <sessionToken>
   * 
   * Respuesta exitosa (200):
   * {
   *   "success": true,
   *   "message": "Sesión cerrada exitosamente"
   * }
   */
  @Post('signout')
  async signOut(@Headers('authorization') authorization: string) {
    // Extraer el token del header Authorization
    const sessionToken = this.extractTokenFromHeader(authorization);

    if (!sessionToken) {
      throw new UnauthorizedException('Token de sesión requerido');
    }

    return this.authService.signOut(sessionToken);
  }

  /**
   * ENDPOINT: Obtener usuario actual
   * 
   * GET /auth/me
   * 
   * Retorna la información del usuario autenticado.
   * Requiere el token de sesión en el header Authorization.
   * 
   * Headers:
   * Authorization: Bearer <sessionToken>
   * 
   * Respuesta exitosa (200):
   * {
   *   "success": true,
   *   "user": {
   *     "id": "uuid",
   *     "email": "usuario@example.com",
   *     "name": "Juan Pérez",
   *     ...
   *   },
   *   "session": {
   *     "sessionToken": "...",
   *     "expires": "..."
   *   }
   * }
   * 
   * Error (401):
   * {
   *   "statusCode": 401,
   *   "message": "Sesión inválida"
   * }
   */
  @Get('me')
  async getMe(@Headers('authorization') authorization: string) {
    // Extraer el token del header Authorization
    const sessionToken = this.extractTokenFromHeader(authorization);

    if (!sessionToken) {
      throw new UnauthorizedException('Token de sesión requerido');
    }

    return this.authService.getUserBySession(sessionToken);
  }

  /**
   * ENDPOINT: Verificar si un email existe
   * 
   * GET /auth/check-email?email=usuario@example.com
   * 
   * Verifica si un email ya está registrado.
   * Útil para validar en formularios de registro.
   * 
   * Query params:
   * - email: Email a verificar
   * 
   * Respuesta:
   * {
   *   "exists": true | false,
   *   "email": "usuario@example.com"
   * }
   */
  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const exists = await this.authService.userExists(email);
    return {
      exists,
      email,
    };
  }

  /**
   * UTILIDAD: Extraer token del header Authorization
   * 
   * El header debe tener el formato:
   * Authorization: Bearer <token>
   * 
   * @param authorization - Header Authorization
   * @returns Token extraído o null
   */
  private extractTokenFromHeader(authorization: string): string | null {
    if (!authorization) {
      return null;
    }

    // El formato esperado es "Bearer <token>"
    const parts = authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

