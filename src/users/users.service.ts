import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    const hasValidProperty = Object.values(body).some(
      (value) => value !== undefined && value !== null,
    );
    if (!hasValidProperty) {
      throw new BadRequestException(
        'At least one property must be provided for update',
      );
    }

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
