import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh-token')
  refreshToken(@Req() req: Request, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(req.user.userId, refreshTokenDto);
  }

  @Post('logout')
  logout(@Req() req: Request, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(req, refreshTokenDto);
  }
}
