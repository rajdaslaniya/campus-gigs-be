import { Module } from '@nestjs/common';
import { GigsController } from './gigs.controller';
import { GigsService } from './gigs.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GigsController],
  providers: [GigsService],
  exports: [],
})
export class GigsModule {}
