import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { CsrfModule } from './csrf/csrf.module';
import { HealthModule } from './health/health.module';
import { LabelsModule } from './labels/labels.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    CsrfModule,
    AuthModule,
    CronJobModule,
    UsersModule,
    ProjectsModule,
    LabelsModule,
    TasksModule,
    CalendarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply HTTP logger middleware to all routes
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');

    // Apply authentication middleware to all routes except public ones
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/health', method: RequestMethod.ALL },
        { path: '/csrf/token', method: RequestMethod.GET },
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
