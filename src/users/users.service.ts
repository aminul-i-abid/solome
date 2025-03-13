import { Injectable, NotFoundException } from '@nestjs/common';
import { hasValidPropertyValidator } from 'src/common/validators/has-valid-property.validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private async currentUser(userId: string) {
    const currentUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    return currentUser;
  }

  async getCurrentUser(userId: string) {
    const currentUser = await this.currentUser(userId);

    return ResponseUtil.success(
      'Successfully fetched user details',
      currentUser,
    );
  }

  async updateCurrentUser(userId: string, body: UpdateUserDto) {
    await this.currentUser(userId);

    // Check if the body has at least one valid property to update
    hasValidPropertyValidator(body);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...body,
      },
    });

    return ResponseUtil.success('User updated successfully');
  }

  async deleteCurrentUser(userId: string) {
    await this.currentUser(userId);

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return ResponseUtil.success('User deleted successfully');
  }
}
