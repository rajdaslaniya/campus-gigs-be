import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from '../shared/mail.service';
import { SubscriptionPlanModule } from '../subscription-plan/subscription-plan.module';
import { BuyPlanModule } from '../buy-plan/buy-plan.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    forwardRef(() => SubscriptionPlanModule),
    forwardRef(() => BuyPlanModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [JwtModule],
})
export class AuthModule {}
