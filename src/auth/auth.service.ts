import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { TokenUtil } from 'src/utils/token.util';
import { LoginDto } from './dto/login.dto';
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
        return ResponseUtil.error(
          'Username already exists',
          HttpStatus.CONFLICT,
          HttpStatus[HttpStatus.CONFLICT],
        );
      }
      return ResponseUtil.error(
        'Email already exists',
        HttpStatus.CONFLICT,
        HttpStatus[HttpStatus.CONFLICT],
      );
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    });

    return ResponseUtil.success(
      'Account created successfully',
      null,
      HttpStatus.OK,
    );
  }

  async login(body: LoginDto) {
    // Find user by username or email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: body.usernameOrEmail },
          { email: body.usernameOrEmail },
        ],
      },
    });

    // If user not found or password doesn't match
    if (!user) {
      return ResponseUtil.error(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
        HttpStatus[HttpStatus.UNAUTHORIZED],
      );
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return ResponseUtil.error(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
        HttpStatus[HttpStatus.UNAUTHORIZED],
      );
    }

    const tokenPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    // Revoke all existing refresh tokens for the user
    await this.prisma.refreshToken.updateMany({
      where: {
        userId: user.id,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    const tokens = TokenUtil.generateTokens(tokenPayload);

    // Create new refresh token
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
      },
    });

    return ResponseUtil.success('Login successful', {
      userId: user.id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
