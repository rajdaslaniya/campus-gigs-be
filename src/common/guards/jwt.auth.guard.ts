import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startWith('Bearer ')) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Authorization header missing',
        error: "Token has been required"
      });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid or expired token',
      });
    }
  }
}
