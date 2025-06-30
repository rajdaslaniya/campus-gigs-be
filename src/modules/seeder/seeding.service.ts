import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ROLE, PROFILE_TYPE } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seedAdmin() {
    const adminEmail = 'admin@campusgigs.com';
    
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('Admin@123', salt);
      
      await this.prisma.user.create({
        data: {
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          role: ROLE.admin,
          is_agreed: true,
          professional_interests: '',
          extracurriculars: '',
          certifications: '',
          skills: [],
          education: '',
          otp: '',
          otp_expiry: '',
          is_banned: false,
          strike_number: 0,
          strike_expiry: null,
          created_at: new Date(),
          updated_at: new Date(),
          is_deleted: false,
        },
      });
      this.logger.log('Admin user created successfully');
    } else {
      this.logger.log('Admin user already exists');
    }
  }

  async seedSubscriptionPlans() {
    const existingCount = await this.prisma.subscriptionPlan.count();
    if (existingCount > 0) {
      this.logger.log(`Skipping subscription plans: ${existingCount} plans already exist.`);
      return;
    }

    const plans = [
      {
        name: 'Basic',
        description: 'Perfect for individuals getting started',
        price: 0,
        is_pro: false,
        most_popular: false,
        button_text: 'Get Started',
        icon: '🚀',
        roles_allowed: [PROFILE_TYPE.user],
        max_gig_per_month: 10,
        max_bit_per_month: 0,
        features: [
          'Create and browse gigs',
          'Basic profile',
          'Standard support',
          '10 gig posts per month',
          '0 bids per month',
          'Basic search filters',
        ],
        can_get_badge: false,
      },
      {
        name: 'Premium',
        description: 'Most popular for active users',
        price: 10,
        is_pro: false,
        most_popular: true,
        button_text: 'Upgrade Now',
        icon: '⭐',
        roles_allowed: [PROFILE_TYPE.user, PROFILE_TYPE.provider],
        max_gig_per_month: 3,
        max_bit_per_month: 10,
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
        can_get_badge: true,
      },
      {
        name: 'Pro',
        description: 'For serious providers',
        price: 20,
        is_pro: true,
        most_popular: false,
        button_text: 'Go Pro',
        icon: '👑',
        roles_allowed: [PROFILE_TYPE.user, PROFILE_TYPE.provider],
        max_gig_per_month: null,
        max_bit_per_month: null,
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
        can_get_badge: true,
      },
    ];

    for (const plan of plans) {
      await this.prisma.subscriptionPlan.create({
        data: plan,
      });
      this.logger.log(`Created plan: ${plan.name}`);
    }
  }

  async runAllSeeds() {
    try {
      await this.seedAdmin();
      await this.seedSubscriptionPlans();
      this.logger.log('All seeds completed successfully');
    } catch (error) {
      this.logger.error('Error running seeds:', error);
      throw error;
    }
    // Add more seed methods
  }
}
