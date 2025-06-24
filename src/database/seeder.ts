import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { SubscriptionPlanService } from '../modules/subscription-plan/subscription-plan.service';
import { CreateSubscriptionDto } from '../modules/subscription-plan/subscription-plan.dto';
import { UserRole } from '../common/utils/enums';
import { UserService } from '../modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const subscriptionService = app.get(SubscriptionPlanService);
  const userService = app.get(UserService);

  // Create admin user if not exists
  const adminEmail = 'admin@campusgigs.com';
  const adminPassword = 'Admin@123';

  try {
    // Check if admin user already exists
    const existingAdmin = await userService.findByEmail(adminEmail);

    if (!existingAdmin) {
      await userService.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isAgreed: true,
        professional_interests: '',
        extracurriculars: '',
        certifications: '',
        skills: [],
        education: '',
        otp: 0,
        otp_expiry: 0,
      });

      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }

  // Check and create subscription plans if needed
  const existingCount = await subscriptionService.countPlans();
  if (existingCount > 0) {
    console.log(
      `ℹ️ Skipping subscription plans: ${existingCount} plans already exist.`,
    );
    await app.close();
    return;
  }

  const plans: CreateSubscriptionDto[] = [
    {
      name: 'Basic',
      description: 'Perfect for individuals getting started',
      price: 0,
      isPro: false,
      mostPopular: false,
      buttonText: 'Get Started',
      icon: '🚀',
      rolesAllowed: [UserRole.USER],
      maxGigsPerMonth: 10,
      maxBidsPerMonth: 0,
      features: [
        'Create and browse gigs',
        'Basic profile',
        'Standard support',
        '10 gig posts per month',
        '0 bids per month',
        'Basic search filters',
      ],
      canGetBadges: false,
    },
    {
      name: 'Premium',
      description: 'Most popular for active users',
      price: 10,
      isPro: false,
      mostPopular: true,
      buttonText: 'Upgrade Now',
      icon: '⭐',
      rolesAllowed: [UserRole.USER, UserRole.PROVIDER],
      maxGigsPerMonth: 3,
      maxBidsPerMonth: 10,
      features: [
        'Everything in Basic',
        'Priority listing',
        'Advanced search filters',
        '3 gig posts per month',
        '10 bids per month',
        'Priority support',
        'Analytics dashboard',
        'Custom profile badge',
      ],
      canGetBadges: true,
    },
    {
      name: 'Pro',
      description: 'For serious providers',
      price: 20,
      isPro: true,
      rolesAllowed: [UserRole.USER, UserRole.PROVIDER],
      maxGigsPerMonth: null,
      maxBidsPerMonth: null,
      features: [
        'Everything in Premium',
        'Featured listings',
        'Advanced analytics',
        'Direct messaging',
        'Custom domain',
        'API access',
        'Priority dispute resolution',
        'Exclusive events access',
        'Unlimited gig posts',
        'Unlimited bids',
      ],
      mostPopular: false,
      buttonText: 'Go Pro',
      icon: '👑',
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
