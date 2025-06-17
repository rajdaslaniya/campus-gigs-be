import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { SignupDto } from '../user/user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private signJWT(payload: any): string {
    return this.jwtService.sign(payload);
  }

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

  async login(authData: AuthDto) {
    const findUser = await this.userService.findByEmail(authData.email);

    if (!findUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found with this email',
      });
    }

    if (!authData.password) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Password is required',
      });
    }

    const valid = await bcrypt.compare(authData.password, findUser.password);
    if (!valid) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const user = {
      id: findUser._id,
      name: findUser.name,
      email: findUser.email,
    };

    const token = this.signJWT(user);

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: { user: findUser, token: token },
    };
  }
}
