import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(body: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
      select: {
        username: true,
        email: true,
      },
    });

    if (existingUser) {
      if (existingUser.username === body.username) {
        return ResponseUtil.error('Username already exists');
      }
      return ResponseUtil.error('Email already exists');
    }

    await this.prisma.user.create({
      data: {
        ...body,
      },
    });

    return ResponseUtil.success('Account created successfully', null, 201);
  }
}
