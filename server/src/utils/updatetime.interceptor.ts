import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class UpdateAuthTimeInterceptor implements NestInterceptor {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();

    if (request.headers.authorization) {
      const token = request.headers.authorization.split(' ')[1];
      const decoded = await this.authService.decodeJwt(token);
      if (decoded.sub) {
        this.userService.updateUserOnlineTimeById(decoded.sub);
      }
    }

    // run the actual route handler
    return handler.handle();
  }
}
