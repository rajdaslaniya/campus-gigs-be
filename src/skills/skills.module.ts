import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [SkillsService],
  controllers: [SkillsController]
})
export class SkillsModule { }
