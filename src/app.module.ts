import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Services
import { AppService } from './app.service';

// Controllers
import { AppController } from './app.controller';

// modules
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './modules/shared/database.module';
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
import { AuthMiddleware } from './common/middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 120 }],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ContactUsModule,
    ProfileModule,
    FaqModule,
    TermsModule,
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('terms-conditions', "faqs");
  }
}
