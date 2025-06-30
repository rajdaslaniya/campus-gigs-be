import { Module } from '@nestjs/common';

import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AiService } from '../shared/ai.service';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [TermsController],
  providers: [TermsService, AiService],
  exports: [TermsService],
})
export class TermsModule {}
