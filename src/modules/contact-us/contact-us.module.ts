import { Module } from '@nestjs/common';
// service
import { ContactUsService } from './contact-us.service';

// controlller
import { ContactUsController } from './contact-us.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AiService } from '../shared/ai.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  controllers: [ContactUsController],
  providers: [ContactUsService, AiService],
})
export class ContactUsModule {}
