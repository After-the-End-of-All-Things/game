import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '@utils/user.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @ApiOperation({ summary: 'Request a verification code' })
  @Post('forgot')
  requestTemporaryPassword(@Body('email') email: string) {
    return this.authService.requestTemporaryPassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh auth token' })
  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  refreshToken(@Headers('authorization') authHeader: string) {
    return this.authService.newJwt(authHeader.split(' ')[1].trim());
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a verification code' })
  @Post('verify/request')
  @UseGuards(JwtAuthGuard)
  requestVerificationCode(@User() user) {
    return this.authService.requestVerificationForUser(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate a verification code' })
  @Post('verify/validate')
  @UseGuards(JwtAuthGuard)
  validateVerificationCode(@User() user, @Body('code') code: string) {
    return this.authService.validateVerificationCodeForUser(user.userId, code);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change a users email address' })
  @Put('email')
  @UseGuards(JwtAuthGuard)
  changeEmail(@User() user, @Body('newEmail') newEmail: string) {
    return this.authService.changeEmail(user.userId, newEmail);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change a users password' })
  @Put('password')
  @UseGuards(JwtAuthGuard)
  changePassword(@User() user, @Body('newPassword') newPassword: string) {
    return this.authService.changePassword(user.userId, newPassword);
  }
}
