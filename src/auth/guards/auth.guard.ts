/**
 * ============================================
 * GUARD DE AUTENTICACIÓN
 * ============================================
 * 
 * Este guard protege rutas que requieren autenticación.
 * Verifica que el request tenga un token de sesión válido
 * en el header Authorization.
 * 
 * Uso en un controlador:
 * @UseGuards(AuthGuard)
 * @Get('protected')
 * async protectedRoute() {
 *   return 'Solo usuarios autenticados pueden ver esto';
 * }
 * 
 * Uso en toda una clase:
 * @Controller('tasks')
 * @UseGuards(AuthGuard)
 * export class TasksController {
 *   // Todas las rutas aquí requieren autenticación
 * }
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  /**
   * Verifica si el usuario está autenticado
   * 
   * @param context - Contexto de ejecución de NestJS
   * @returns true si está autenticado, lanza excepción si no
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extraer el header Authorization
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token de autenticación requerido');
    }

    // Extraer el token (formato: "Bearer <token>")
    const token = this.extractToken(authorization);

    if (!token) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      // Verificar el token y obtener el usuario
      const result = await this.authService.getUserBySession(token);

      // Agregar el usuario al request para uso posterior
      request.user = result.user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
  }

  /**
   * Extrae el token del header Authorization
   * 
   * @param authorization - Header Authorization
   * @returns Token o null
   */
  private extractToken(authorization: string): string | null {
    const parts = authorization.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

