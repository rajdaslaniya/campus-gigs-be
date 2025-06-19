import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
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

// midleware
import { LoggingMiddleware } from './common/middlewares/logging.middleware';

// configs
import { ConfigModule } from '@nestjs/config';

// helpers
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BadgeModule } from './modules/badge/badge.module';
import { SubscriptionPlanModule } from './modules/subscription-plan/subscription-plan.module';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 120 }],
    }),
    SharedDatabaseModule,
    UserModule,
    AuthModule,
    BadgeModule,
    SubscriptionPlanModule,
    ContactUsModule,
    FaqModule,
    TermsModule,
    ProfileModule,
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
