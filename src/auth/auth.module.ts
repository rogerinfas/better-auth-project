/**
 * ============================================
 * MÓDULO DE AUTENTICACIÓN
 * ============================================
 * 
 * Este módulo encapsula toda la funcionalidad de autenticación:
 * - AuthService: Lógica de negocio
 * - AuthController: Endpoints REST
 * - Guards y decoradores para proteger rutas
 */

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Exportar para usar en otros módulos
})
export class AuthModule {}

