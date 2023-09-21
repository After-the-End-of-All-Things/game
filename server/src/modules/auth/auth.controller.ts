import { UserService } from '@modules/user/user.service';
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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register a new account' })
  @Post('register')
  signUp(@Body() signInDto: Record<string, any>) {
    if (!signInDto.username || !signInDto.password || !signInDto.email)
      return { error: 'Missing username, password or email' };

    if (signInDto.username.length < 2 || signInDto.username.length > 20)
      return { error: 'Username must be between 2 and 20 characters long' };

    if (signInDto.password.length < 8)
      return { error: 'Password must be at least 8 characters long' };

    return this.authService.signUp(
      signInDto.username,
      signInDto.password,
      signInDto.email,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log into an account' })
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    if (!signInDto.password || !signInDto.email)
      throw new BadRequestException('Missing password or email');

    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh auth token' })
  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Headers('authorization') authHeader: string) {
    return this.authService.newJwt(authHeader.split(' ')[1].trim());
  }
}
