import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CronJob } from './cron-job.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [CronJob],
})
export class CronJobModule {}
