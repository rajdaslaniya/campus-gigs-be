import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserFromToken {
  constructor(@Inject() private jwtService: JwtService) {}

  getUserIdFromToken(request: Request) {
    const token = (request.headers['authorization'] as string).split(' ')[1];
    const user = this.jwtService.verify(token);
    return user.id;
  }
}
