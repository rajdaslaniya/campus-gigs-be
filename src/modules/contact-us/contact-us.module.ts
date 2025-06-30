import { Module } from '@nestjs/common';
// service
import { ContactUsService } from './contact-us.service';

// controlller
import { ContactUsController } from './contact-us.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AiService } from '../shared/ai.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ContactUsController],
  providers: [ContactUsService, AiService],
})
export class ContactUsModule {}
