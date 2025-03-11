import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronJob {
  private readonly logger = new Logger(CronJob.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Cron job that runs daily at midnight to clean up revoked refresh tokens
   * that are older than 15 days
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupRevokedRefreshTokens() {
    this.logger.log('Starting cleanup of revoked refresh tokens...');

    try {
      // Calculate the date 15 days ago
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      // Delete revoked tokens created more than 15 days ago
      const result = await this.prisma.refreshToken.deleteMany({
        where: {
          isRevoked: true,
          createdAt: {
            lt: fifteenDaysAgo,
          },
        },
      });

      this.logger.log(
        `Successfully deleted ${result.count} revoked refresh tokens`,
      );
    } catch (error) {
      this.logger.error('Error cleaning up revoked refresh tokens:', error);
    }
  }
}
