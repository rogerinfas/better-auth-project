import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
      include: {
        user: true,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        user: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
  }

  async toggleComplete(id: string) {
    const task = await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
      include: {
        user: true,
      },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }
  }
}

