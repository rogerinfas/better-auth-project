/**
 * ============================================
 * SERVICIO DE AUTENTICACIÓN
 * ============================================
 * 
 * Este servicio maneja todas las operaciones de autenticación:
 * - Registro de usuarios
 * - Inicio de sesión
 * - Cierre de sesión
 * - Verificación de sesiones
 * - Obtención de información del usuario actual
 * 
 * Usa Better-Auth internamente para manejar la lógica de autenticación
 */

import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { authConfig } from './auth.config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * REGISTRO DE NUEVO USUARIO
   * 
   * Crea un nuevo usuario en la base de datos con email y contraseña.
   * La contraseña se hashea automáticamente antes de guardarla.
   * 
   * @param email - Email del usuario
   * @param password - Contraseña en texto plano
   * @param name - Nombre del usuario (opcional)
   * @returns Usuario creado (sin la contraseña)
   */
  async signUp(email: string, password: string, name?: string) {
    // Verificar que el email no esté ya registrado
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña con bcrypt (10 rondas de salt)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        // emailVerified será null hasta que el usuario verifique su email
        emailVerified: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        // NO retornar la contraseña
      },
    });

    return {
      success: true,
      user,
      message: 'Usuario registrado exitosamente',
    };
  }

  /**
   * INICIO DE SESIÓN
   * 
   * Autentica a un usuario con email y contraseña.
   * Si las credenciales son correctas, crea una sesión.
   * 
   * @param email - Email del usuario
   * @param password - Contraseña en texto plano
   * @returns Usuario autenticado y token de sesión
   */
  async signIn(email: string, password: string) {
    // Buscar el usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Si no existe el usuario
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Si el usuario no tiene contraseña (usa OAuth)
    if (!user.password) {
      throw new UnauthorizedException('Este usuario debe iniciar sesión con OAuth');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Crear una nueva sesión
    const session = await this.createSession(user.id);

    // Retornar usuario (sin contraseña) y token de sesión
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      },
      session: {
        sessionToken: session.sessionToken,
        expires: session.expires,
      },
      message: 'Inicio de sesión exitoso',
    };
  }

  /**
   * CREAR SESIÓN
   * 
   * Crea una nueva sesión para un usuario.
   * La sesión expira después de 30 días.
   * 
   * @param userId - ID del usuario
   * @returns Sesión creada
   */
  private async createSession(userId: string) {
    // Generar un token único para la sesión
    const sessionToken = this.generateSessionToken();

    // Calcular fecha de expiración (30 días desde ahora)
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    // Crear la sesión en la base de datos
    const session = await this.prisma.session.create({
      data: {
        sessionToken,
        userId,
        expires,
      },
    });

    return session;
  }

  /**
   * CERRAR SESIÓN
   * 
   * Elimina la sesión actual del usuario.
   * 
   * @param sessionToken - Token de la sesión a eliminar
   */
  async signOut(sessionToken: string) {
    // Eliminar la sesión de la base de datos
    await this.prisma.session.delete({
      where: { sessionToken },
    });

    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    };
  }

  /**
   * OBTENER USUARIO POR SESIÓN
   * 
   * Verifica que una sesión sea válida y retorna el usuario asociado.
   * 
   * @param sessionToken - Token de la sesión
   * @returns Usuario autenticado
   * @throws UnauthorizedException si la sesión es inválida o expiró
   */
  async getUserBySession(sessionToken: string) {
    // Buscar la sesión en la base de datos
    const session = await this.prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    // Si la sesión no existe
    if (!session) {
      throw new UnauthorizedException('Sesión inválida');
    }

    // Si la sesión expiró
    if (session.expires < new Date()) {
      // Eliminar la sesión expirada
      await this.prisma.session.delete({
        where: { sessionToken },
      });
      throw new UnauthorizedException('Sesión expirada');
    }

    // Retornar usuario (sin contraseña)
    const { password, ...userWithoutPassword } = session.user;

    return {
      success: true,
      user: userWithoutPassword,
      session: {
        sessionToken: session.sessionToken,
        expires: session.expires,
      },
    };
  }

  /**
   * VERIFICAR SI UN USUARIO EXISTE
   * 
   * @param email - Email a verificar
   * @returns true si el usuario existe
   */
  async userExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  /**
   * GENERAR TOKEN DE SESIÓN
   * 
   * Genera un token aleatorio y único para identificar una sesión.
   * Usa caracteres alfanuméricos seguros.
   * 
   * @returns Token de sesión
   */
  private generateSessionToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  /**
   * ELIMINAR SESIONES EXPIRADAS
   * 
   * Limpia las sesiones que ya expiraron de la base de datos.
   * Este método debería ejecutarse periódicamente (ej: con un cron job).
   */
  async cleanExpiredSessions() {
    const result = await this.prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    return {
      success: true,
      deletedSessions: result.count,
      message: `${result.count} sesiones expiradas eliminadas`,
    };
  }
}

