import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { CsrfModule } from './csrf/csrf.module';
import { HealthModule } from './health/health.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { HttpLoggerMiddleware } from './middleware/http-logger.middleware';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, HealthModule, CsrfModule, AuthModule, CronJobModule],
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
      )
      .forRoutes('*');
  }
}
