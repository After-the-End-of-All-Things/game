import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { UserService } from '../modules/user/user.service';

@Injectable()
export class UpdateAuthTimeInterceptor implements NestInterceptor {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const ignoredRoutes = [
      '/auth/login',
      '/auth/register',
      '/user/online',
      '/notification/mine',
      '/notification/mine/after',
    ];

    if (
      request.headers.authorization &&
      !ignoredRoutes.includes(request.route.path)
    ) {
      const token = request.headers.authorization.split(' ')[1];
      const decoded = await this.authService.decodeJwt(token);
      if (decoded.sub) {
        await this.userService.updateUserOnlineTimeById(decoded.sub);
      }
    }

    // run the actual route handler
    return handler.handle();
  }
}
