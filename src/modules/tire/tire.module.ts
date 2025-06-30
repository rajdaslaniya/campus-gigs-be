import { Module } from '@nestjs/common';
import { TireService } from './tire.service';
import { TireController } from './tire.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule, PrismaService],
  controllers: [TireController],
  providers: [TireService],
  exports: [TireService],
})
export class TireModule {}
