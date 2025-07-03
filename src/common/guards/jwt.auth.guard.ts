import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Authorization header missing',
        error: 'Token is required',
      });
    }

    const token = authHeader.split(' ')[1];
    try {
      // Verify JWT token
      const payload = this.jwtService.verify(token);

      // Verify user exists in database
      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          message: 'User not found',
        });
      }

      // Attach user to request object
      request.user = {
        ...payload,
        user, // Attach full user object if needed
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired token',
        error: error.message,
      });
    }
  }
}
