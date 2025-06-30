import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { SeedingService } from './seeding.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule implements OnModuleInit {
  private readonly logger = new Logger(SeedingModule.name);

  constructor(private readonly seedingService: SeedingService) {}

  async onModuleInit() {
    try {
      this.logger.log('Running database seeds...');
      await this.seedingService.runAllSeeds();
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Error seeding database:', error);
      process.exit(1);
    }
  }
}
