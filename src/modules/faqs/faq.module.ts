import { Module } from '@nestjs/common';

import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AiService } from '../shared/ai.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  controllers: [FaqController],
  providers: [FaqService, AiService],
})
export class FaqModule {}
