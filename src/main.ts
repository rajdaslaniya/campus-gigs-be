import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { json, urlencoded } from "express";
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Register global filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // handle common response by using interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // helmet middlewares
  app.use(helmet());

  // enables cors
  app.enableCors({
    // origin: "https...."
    origin: true,
    methos: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // json limits
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
