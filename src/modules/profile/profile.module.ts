import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [],
})

export class ProfileModule {}
