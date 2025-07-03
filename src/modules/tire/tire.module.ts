import { Module } from '@nestjs/common';
import { TireService } from './tire.service';
import { TireController } from './tire.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [TireController],
  providers: [TireService],
  exports: [TireService],
})
export class TireModule {}
