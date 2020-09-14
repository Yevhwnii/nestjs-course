import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // this is our root module and its configuration will apply to all submodules
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
