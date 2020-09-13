// repositories is additional layer over our persistance layer
// which helps us encupsulate interaction with database.
// so that if we need somewhere work with database, we use repository class for this and
// communicate with db thru it.

import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

// Telling that this repository will be used for task entity and will hold generic type of Task entity
// Repository base class exposes all the methods needed to work with entity and additionally create custom methods
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    // Good idea to return created resource to the frontend
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    // query builder is used for more complex conditional queries
    // since it is called in tasks repository it will create query builder which interacts with task table
    // we provide argument to which we can later refer in query
    const query = this.createQueryBuilder('task');

    if (status) {
      // adds AND WHERE to the query, where task is an argument in queryBuild to which we can refer as an entity
      // and :status is dynamic part which gets injected as second parameter and have to bear the same name
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        // % sign allows partial match
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}

// Now that repository may be used thru DI in services