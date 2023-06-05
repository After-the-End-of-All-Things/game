import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signInDto: Record<string, any>) {
    if (!signInDto.username || !signInDto.password || !signInDto.email)
      throw new BadRequestException('Missing username, password or email');

    if (signInDto.username.length < 3 || signInDto.username.length > 20)
      throw new BadRequestException(
        'Username must be between 3 and 20 characters long',
      );

    if (signInDto.password.length < 8)
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );

    return this.authService.signUp(
      signInDto.username,
      signInDto.password,
      signInDto.email,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    if (!signInDto.password || !signInDto.email)
      throw new BadRequestException('Missing password or email');

    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Headers('authorization') authHeader: string) {
    return this.authService.newJwt(authHeader.split(' ')[1].trim());
  }
}
