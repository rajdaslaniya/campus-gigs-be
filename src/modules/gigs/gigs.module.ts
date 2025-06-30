import { Module } from '@nestjs/common';
import { GigsController } from './gigs.controller';
import { GigsService } from './gigs.service';
import { AuthModule } from '../auth/auth.module';
import { UserFromToken } from '../shared/userFromToken.service';
import { TireModule } from '../tire/tire.module';
import { AwsS3Service } from '../shared/aws-s3.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [AuthModule, TireModule, PrismaService],
  controllers: [GigsController],
  providers: [GigsService, UserFromToken, AwsS3Service],
  exports: [],
})
export class GigsModule {}
