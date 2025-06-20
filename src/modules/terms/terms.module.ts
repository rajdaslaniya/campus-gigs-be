import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Terms, TermsSchema } from './terms.schema';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([{ name: Terms.name, schema: TermsSchema }]),
  ],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}
