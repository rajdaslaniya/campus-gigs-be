import { Module } from '@nestjs/common';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';

@Module({
  imports: [
    PrivacyPolicyModule,
  ],
})
export class AppModule {} 