import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { AppService } from './app.service';

// Controllers
import { AppController } from './app.controller';

// modules
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { ProfileModule } from './modules/profile/profile.module';
import { FaqModule } from './modules/faqs/faq.module';
import { TermsModule } from './modules/terms/terms.module';
import { PrivacyPolicyModule } from './modules/privacy-policy/privacy-policy.module';
import { BadgeModule } from './modules/badge/badge.module';
import { SubscriptionCronModule } from './modules/subscription/subscription-cron.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { TireModule } from './modules/tire/tire.module';
import { BuyPlanModule } from './modules/buy-plan/buy-plan.module';

// middleware
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

// configs
import { ConfigModule, ConfigService } from '@nestjs/config';

// helpers
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { SeedingModule } from './modules/seeder/seeding.module';
import { GigsCategoryModule } from './modules/gigscategory/gigscategory.module';
import { GigsModule } from './modules/gigs/gigs.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { BidsModule } from './modules/bids/bids.module';
import { SkillsModule } from './modules/skills/skills.module';

@Module({
  imports: [
    // Config and core modules
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),

    // Auth and User related modules (with circular deps)
    forwardRef(() => AuthModule),
    UserModule,

    // Subscription related modules (with circular deps)
    forwardRef(() => SubscriptionPlanModule),
    forwardRef(() => BuyPlanModule),

    // Other feature modules
    SubscriptionCronModule,
    ContactUsModule,
    ProfileModule,
    FaqModule,
    TermsModule,
    PrivacyPolicyModule,
    BadgeModule,
    TireModule,

    // Third-party modules
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 120 }],
    }),
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
    PrismaModule,
    UserModule,
    BadgeModule,
    SubscriptionPlanModule,
    ContactUsModule,
    FaqModule,
    TermsModule,
    TireModule,
    SeedingModule,
    PrivacyPolicyModule,
    GigsCategoryModule,
    BidsModule,
    SkillsModule,
    GigsModule,
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
