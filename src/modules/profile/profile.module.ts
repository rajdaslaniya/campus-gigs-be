import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { UserFromToken } from '../shared/userFromToken.service';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [ProfileController],
  providers: [ProfileService, UserFromToken],
  exports: [],
})

export class ProfileModule {}
