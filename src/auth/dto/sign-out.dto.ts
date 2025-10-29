/**
 * DTO para cerrar sesión
 */
export class SignOutDto {
  /**
   * Token de la sesión a cerrar
   * Este token se obtiene al hacer login
   */
  sessionToken: string;
}

