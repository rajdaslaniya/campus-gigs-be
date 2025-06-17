import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['token'] as string;

    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const secret = process.env.JWT_SECRET || 'your_jwt_secret';
      const decoded = jwt.verify(token, secret);
      req['user'] = decoded; // attach user info to request if needed
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
