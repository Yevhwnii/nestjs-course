import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

// Pipes are function which is called before the route handler executes
// Route handler pass values to them, they proceed values passed and pass back those modified values
// They are mostly used for data transformation of data validation since they receive arguments before route handler,
// check them, and either pass them forward or throw an exception

// In order to create custom pipe, it should implement PipeTransform interface and transform() method

// When pipe is used, we can initialize it and add some configuration thru constuctor function

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any) {
    // metadata looks like this: { metatype: [Function: String], type: 'body', data: 'status' }
    // it contains the source of value (body) and under which key it is preserved (status)
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1; // since if status is not found, indexOf method will return -1 we convert it to boolean and return
  }
}
