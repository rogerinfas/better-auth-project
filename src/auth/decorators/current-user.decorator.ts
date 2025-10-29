/**
 * ============================================
 * DECORADOR @CurrentUser()
 * ============================================
 * 
 * Este decorador se usa para obtener el usuario autenticado
 * en los controladores.
 * 
 * Uso:
 * @Get('perfil')
 * async getPerfil(@CurrentUser() user: User) {
 *   return user;
 * }
 * 
 * El usuario se extrae del request.user que es seteado
 * por el AuthGuard.
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

