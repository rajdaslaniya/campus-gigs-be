import { Module } from '@nestjs/common';

import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AiService } from '../shared/ai.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [FaqController],
  providers: [FaqService, AiService],
})
export class FaqModule {}
