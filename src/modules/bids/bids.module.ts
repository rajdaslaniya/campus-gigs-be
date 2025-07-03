import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [BidsService],
  controllers: [BidsController]
})
export class BidsModule {}
