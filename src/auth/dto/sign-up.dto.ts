/**
 * DTO para el registro de nuevos usuarios
 */
export class SignUpDto {
  /**
   * Email del usuario (debe ser único)
   * Ejemplo: "usuario@example.com"
   */
  email: string;

  /**
   * Contraseña del usuario
   * Mínimo 6 caracteres
   * Será hasheada antes de guardarse
   */
  password: string;

  /**
   * Nombre del usuario (opcional)
   * Ejemplo: "Juan Pérez"
   */
  name?: string;
}

