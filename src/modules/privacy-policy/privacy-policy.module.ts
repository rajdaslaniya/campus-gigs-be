import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivacyPolicyService } from './privacy-policy.service';
import { PrivacyPolicyController } from './privacy-policy.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AiService } from '../shared/ai.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService, AiService],
})
export class PrivacyPolicyModule {}
