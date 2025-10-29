import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, UsersModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
