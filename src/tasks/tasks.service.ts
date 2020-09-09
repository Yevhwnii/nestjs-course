import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';

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

  createTask(title: string, description: string): Task {
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
}
