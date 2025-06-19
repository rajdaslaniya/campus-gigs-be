import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { SignupDto } from '../user/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/utils/multer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  register(
    @Body() userBody: SignupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.registerUser(userBody, file);
  }

  @Post('/login')
  login(@Body() authData: AuthDto) {
    return this.authService.login(authData);
  }

  @Post('/forgot-password')
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }
}
