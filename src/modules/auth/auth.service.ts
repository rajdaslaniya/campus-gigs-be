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
import { MailService } from '../shared/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private signJWT(payload: any): string {
    return this.jwtService.sign(payload);
  }

  async registerUser(userBody: SignupDto, file?: Express.Multer.File) {
    const existingUserWithEmail = await this.userService.findByEmail(
      userBody.email,
    );

    if (existingUserWithEmail) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        message: 'Email already registered',
      });
    }

    const user = await this.userService.create(userBody, file);

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
      role: findUser.role,
    };

    const token = this.signJWT(user);

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: { user: findUser, token: token },
    };
  }

  async forgotPassword(email: string) {
    const findUser = await this.userService.findByEmail(email);
    if (!findUser) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    let otp = Math.random();
    otp = Math.floor(100000 + Math.random() * 900000);

    this.userService.updateUser(findUser._id as string, {
      otp: otp,
      otp_expiry: Date.now() + 5 * 60 * 1000,
    });

    this.mailService.sendOtpMail(email, findUser.name, otp);

    return {
      status: HttpStatus.OK,
      message: 'Otp has been send successfully',
      data: {
        email: email,
      },
    };
  }
}
