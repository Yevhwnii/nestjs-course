import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';

@Module({
  // Make Task repository be available thru DI in other files
  // we called .forRoot in app module to import config for all other db connections
  // and here we use .forFeature in order to include our TaskRepository to the typeorm ecosystem
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
