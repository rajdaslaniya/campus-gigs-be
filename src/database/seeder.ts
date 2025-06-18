// seeder.ts (in project root)
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SubscriptionPlanService } from '../modules/subscription-plan/subscription-plan.service';
import { CreateSubscriptionDto } from '../modules/subscription-plan/subscription-plan.dto';
import { UserRole } from '../common/utils/enums';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const subscriptionService = app.get(SubscriptionPlanService);

  const existingCount = await subscriptionService.countPlans();
  if (existingCount > 0) {
    console.log(
      `❌ Skipping seeder: ${existingCount} subscription plans already exist.`,
    );
    await app.close();
    return;
  }

  const plans: CreateSubscriptionDto[] = [
    {
      name: 'Free',
      description: 'Perfect for individuals getting started',
      price: 0,
      isPro: false,
      rolesAllowed: [UserRole.USER],
      maxGigsPerMonth: 10,
      maxBidsPerMonth: 0,
      features: ['10 gig posts per month', '0 bids per month', 'Free support'],
      canGetBadges: false,
    },
    {
      name: 'Basic',
      description: 'Perfect for businesses getting started',
      price: 10,
      isPro: false,
      rolesAllowed: [UserRole.USER, UserRole.PROVIDER],
      maxGigsPerMonth: 3,
      maxBidsPerMonth: 10,
      features: ['3 gig posts per month', '10 bids per month', 'Basic support'],
      canGetBadges: true,
    },
    {
      name: 'Pro',
      description: 'For professionals who need more',
      price: 20,
      isPro: true,
      rolesAllowed: [UserRole.USER, UserRole.PROVIDER],
      maxGigsPerMonth: null,
      maxBidsPerMonth: null,
      features: [
        'Unlimited gig posts',
        'Unlimited bids',
        'Priority support',
        'Featured gigs',
        'Analytics dashboard',
      ],
      canGetBadges: true,
    },
  ];
  for (const plan of plans) {
    await subscriptionService.create(plan);
    console.log(`✅ Created plan: ${plan.name}`);
  }

  await app.close();
}

bootstrap();
