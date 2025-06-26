import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// schema
import { ContactUs, ContactUsSchema } from './contact-us.schema';

// service
import { ContactUsService } from './contact-us.service';

// controlller
import { ContactUsController } from './contact-us.controller';
import { AuthModule } from '../auth/auth.module';
import { AiService } from '../faqs/ai.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: ContactUs.name, schema: ContactUsSchema }]),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService, AiService],
})
export class ContactUsModule {}
