import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UserBody } from './user.dto';

@Controller()
export class UserController {
  constructor(@Inject() private userService: UserService) {}

  @Post('/register')
  createUser(@Body() body: UserBody) {
    this.userService.createUser(body);
  }

  
}
