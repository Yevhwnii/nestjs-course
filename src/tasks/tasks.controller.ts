import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // Validation pipe is smart enough to take dto argument and validate it against
  // rules defined in class dto
  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  // We can either extract the whole body or specific parameters to work with
  // When req will come, nestjs will parse the body and extract value of specific keys we defined

  // When using DTO, we shape it in other file and specify that when req will come,
  // @body decarator will parse it and compare to our schema of dto to contain such properties
  @Post()
  // Validation pipe will validate incoming data against provided dto (which includes validation from class-validator) and throw an exception if it fails
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string) {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateStatus(id, status);
  }
}
