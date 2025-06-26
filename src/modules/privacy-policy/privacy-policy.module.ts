import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivacyPolicy, PrivacyPolicySchema } from './privacy-policy.schema';
import { PrivacyPolicyService } from './privacy-policy.service';
import { PrivacyPolicyController } from './privacy-policy.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AiService } from '../faqs/ai.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([{ name: PrivacyPolicy.name, schema: PrivacyPolicySchema }]),
  ],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService, AiService],
})
export class PrivacyPolicyModule {} 