import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

// Services are like modules which can be injected in any place and be used
// They are singletones which means there is only 1 instance of service at the time
// They contain all the bussiness logic of the application and then injected in constuctor functions and used by other components of an app
@Injectable()
export class TasksService {
  constructor(
    // Injecting repository
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  // LEGACY CODE:
  // Making it private to that controllers which use this service cannot directly manipulate the array. They should
  // only be able to manipulate thru method in this service
  // const tasks: string[] = []

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    // Throws it here, and NestJs on the background will recognize it as Http expection and return response to the client with formatted error
    if (!found) {
      throw new NotFoundException(`Task with provided ID (${id}) not found!`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    // remove means that you have to firstly retreive the entity from db and then pass entity as an argument for remove method
    // which is quite expensive, while delete - deletes entity by criteria and does not require any extra work to be done
    const result = await this.taskRepository.delete({ id, userId: user.id });
    // amount of rows affected by query
    if (result.affected === 0) {
      throw new NotFoundException(`Could not find requested task (ID: ${id})`);
    }
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }

  // updateStatus(id: string, status: TaskStatus): Task {
  //   // task is a reference to the item of an array
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
