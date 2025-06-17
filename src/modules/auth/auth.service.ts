import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { SignupDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(userBody: SignupDto) {
    const existingUserWithEmail = await this.userService.findByEmail(
      userBody.email,
    );
    
    if (existingUserWithEmail) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Email already registered',
      });
    }

    const user = await this.userService.create(userBody);

    return {
      status: HttpStatus.CREATED,
      message: 'User has been registered',
      data: user,
    };
  }

  login(authData: AuthDto) {
    console.log(authData);
  }
}
