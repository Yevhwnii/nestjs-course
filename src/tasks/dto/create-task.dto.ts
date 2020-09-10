// DTO - Data Transfer Object which is used in software development
// to specify shape of the data thru processes.
// In our case, it is shape of argument accepted by service functions

import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
