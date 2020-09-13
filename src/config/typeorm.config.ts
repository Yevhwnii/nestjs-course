import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// pg is postgres driver for nodejs
// we explicitly define type of our database so that typeorm know which driver to use (pg here)

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'ichigo32',
  database: 'taskmanagement',
  // any file in src folder with .entity.ts extension
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  // in prod change to false
  synchronize: true,
};
