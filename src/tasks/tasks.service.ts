import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

// Services are like modules which can be injected in any place and be used
// They are singletones which means there is only 1 instance of service at the time
// They contain all the bussiness logic of the application and then injected in constuctor functions and used by other components of an app
@Injectable()
export class TasksService {
  // Making it private to that controllers which use this service cannot directly manipulate the array. They should
  // only be able to manipulate thru method in this service
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find(task => id === task.id);

    // Throws it here, and NestJs on the background will recognize it as Http expection and return response to the client with formatted error
    if (!found) {
      throw new NotFoundException(`Task with provided ID (${id}) not found!`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    // Good idea to return created resource to the frontend
    return task;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => {
      return task.id !== found.id;
    });
  }

  updateStatus(id: string, status: TaskStatus): Task {
    // task is a reference to the item of an array
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}
