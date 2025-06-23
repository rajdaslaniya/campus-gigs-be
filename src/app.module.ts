import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';

// Controllers
import { AppController } from './app.controller';

// modules
import { UserModule } from './modules/user/user.module';
import { DatabaseModule as SharedDatabaseModule } from './modules/shared/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FaqModule } from './modules/faqs/faq.module';
import { TermsModule } from './modules/terms/terms.module';
import { PrivacyPolicyModule } from './modules/privacy-policy/privacy-policy.module';

// middleware
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

// configs
import { ConfigModule, ConfigService } from '@nestjs/config';

// helpers
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { BadgeModule } from './modules/badge/badge.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { RolesGuard } from './common/guards/roles.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { TireModule } from './modules/tire/tire.module';
import { GigsModule } from './modules/gigs/gigs.module';
import { PlansModule } from './modules/plans/plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 120 }],
    }),
    SharedDatabaseModule,
    EventEmitterModule.forRoot({
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"Campusgigs" <${config.get<string>('EMAIL_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BadgeModule,
    SubscriptionPlanModule,
    PlansModule,
    ContactUsModule,
    FaqModule,
    TermsModule,
    TireModule,
    GigsModule,
    ProfileModule,
    PrivacyPolicyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
