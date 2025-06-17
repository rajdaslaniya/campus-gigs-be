import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [],
})
export class PlanModule {}
