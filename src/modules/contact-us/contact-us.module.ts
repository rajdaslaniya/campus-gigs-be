import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// schema
import { ContactUs, ContactUsSchema } from './contact-us.schema';

// service
import { ContactUsService } from './contact-us.service';

// controlller
import { ContactUsController } from './contact-us.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ContactUs.name, schema: ContactUsSchema }]),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
})
export class ContactUsModule {}
