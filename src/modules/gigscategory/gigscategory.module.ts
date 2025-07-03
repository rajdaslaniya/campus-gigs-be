import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GigsCategoryService } from './gigscategory.service';
import { GigsCategoryController } from './gigscategory.controller';
import { TireModule } from '../tire/tire.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, TireModule, UserModule],
  controllers: [GigsCategoryController],
  providers: [GigsCategoryService],
  exports: [GigsCategoryService],
})
export class GigsCategoryModule {}
