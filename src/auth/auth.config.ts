/**
 * ============================================
 * CONFIGURACIÓN DE AUTENTICACIÓN
 * ============================================
 * 
 * Este archivo define las constantes y configuraciones para el sistema de autenticación.
 * 
 * El sistema implementa:
 * - Autenticación con email/password
 * - Sesiones persistentes en base de datos
 * - Hashing de contraseñas con bcrypt
 * - Tokens de sesión seguros
 * 
 * NOTA: Esta implementación usa Prisma directamente con bcrypt.
 * Better-Auth está instalado pero no se usa directamente para tener
 * control total sobre la autenticación.
 */

/**
 * Configuración de autenticación
 */
export const authConfig = {
  /**
   * URL base de la aplicación
   * Usado para generar URLs de callback, verificación, etc.
   */
  baseURL: process.env.BASE_URL || 'http://localhost:3000',

  /**
   * Secret para firmar tokens JWT y cookies
   * ⚠️ IMPORTANTE: Cambiar en producción y usar variable de entorno
   * Debe tener al menos 32 caracteres
   */
  secret: process.env.AUTH_SECRET || 'your-super-secret-key-change-in-production-min-32-chars',

  /**
   * Configuración de sesiones
   */
  session: {
    /**
     * Duración de la sesión en días
     * Después de este tiempo, el usuario debe volver a iniciar sesión
     */
    expiresInDays: 30,

    /**
     * Duración de la sesión en segundos (calculada)
     */
    expiresInSeconds: 60 * 60 * 24 * 30, // 30 días
  },

  /**
   * Configuración de contraseñas
   */
  password: {
    /**
     * Longitud mínima de la contraseña
     */
    minLength: 6,

    /**
     * Número de rondas de salt para bcrypt
     * Mayor número = más seguro pero más lento
     * Recomendado: 10-12
     */
    saltRounds: 10,
  },
};

/**
 * Tipos para TypeScript
 * Estos tipos se usan en toda la aplicación para type-safety
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  session?: {
    sessionToken: string;
    expires: Date;
  };
  message: string;
}

