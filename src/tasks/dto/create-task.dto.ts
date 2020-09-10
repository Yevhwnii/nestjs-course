// DTO - Data Transfer Object which is used in software development
// to specify shape of the data thru processes.
// In our case, it is shape of argument accepted by service functions

export class CreateTaskDto {
  title: string;
  description: string;
}
