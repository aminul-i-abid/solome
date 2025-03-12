import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getCurrentUser(userId: string) {
    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!currentUser) {
      return ResponseUtil.error('User not found', HttpStatus.NOT_FOUND);
    }

    Logger.log(`Fetched user details for user ID: ${currentUser.id}`);

    return ResponseUtil.success(
      'Successfully fetched user details',
      currentUser,
    );
  }
}
