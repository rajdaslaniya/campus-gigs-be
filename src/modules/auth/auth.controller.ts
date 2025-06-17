import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { SignupDto } from '../user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() userBody: SignupDto) {
    return this.authService.registerUser(userBody);
  }

  @Post('/login')
  login(@Body() authData: AuthDto) {
    return this.authService.login(authData);
  }
}
