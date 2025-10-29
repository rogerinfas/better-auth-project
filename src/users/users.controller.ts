import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controlador de Usuarios - PROTEGIDO
 * Todas las rutas requieren autenticación
 * Los usuarios solo pueden ver y modificar su propia información
 */
@Controller('users')
@UseGuards(AuthGuard) // Protege todas las rutas
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('me')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  /**
   * Actualizar perfil del usuario autenticado
   */
  @Patch('me')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: any) {
    return this.usersService.update(user.id, updateUserDto);
  }

  /**
   * Eliminar cuenta del usuario autenticado
   */
  @Delete('me')
  deleteAccount(@CurrentUser() user: any) {
    return this.usersService.remove(user.id);
  }
}

