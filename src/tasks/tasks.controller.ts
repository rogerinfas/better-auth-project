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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controlador de Tareas - PROTEGIDO
 * Todas las rutas requieren autenticación
 * Los usuarios solo pueden ver y modificar sus propias tareas
 */
@Controller('tasks')
@UseGuards(AuthGuard) // Protege todas las rutas de este controlador
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Crear tarea para el usuario autenticado
   */
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    // Asegurar que la tarea se cree para el usuario autenticado
    return this.tasksService.create({ ...createTaskDto, userId: user.id });
  }

  /**
   * Obtener todas las tareas del usuario autenticado
   */
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.tasksService.findByUserId(user.id);
  }

  /**
   * Obtener una tarea específica (solo si pertenece al usuario)
   */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.findOne(id, user.id);
  }

  /**
   * Actualizar tarea (solo si pertenece al usuario)
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  /**
   * Alternar estado completado (solo si pertenece al usuario)
   */
  @Patch(':id/toggle')
  toggleComplete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.toggleComplete(id, user.id);
  }

  /**
   * Eliminar tarea (solo si pertenece al usuario)
   */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.remove(id, user.id);
  }
}

