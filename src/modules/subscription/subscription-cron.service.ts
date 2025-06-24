import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BuyPlan, BuyPlanDocument } from '../buy-plan/buy-plan.schema';
import { SubscriptionPlan } from '../subscription-plan/subscription-plan.schema';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';
import { BuyPlanService } from '../buy-plan/buy-plan.service';
import { BUY_PLAN_STATUS } from 'src/utils/enums';

@Injectable()
export class SubscriptionCronService {
  private readonly logger = new Logger(SubscriptionCronService.name);

  constructor(
    @InjectModel(BuyPlan.name) private buyPlanModel: Model<BuyPlanDocument>,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly buyPlanService: BuyPlanService,
  ) {}

  // Run every minute
  @Cron('0 0 * * *')
  async handleExpiredSubscriptions() {
    this.logger.log('Checking for expired subscriptions...');

    try {
      const now = new Date();

      // Find all active plans that have expired
      const expiredPlans = await this.buyPlanModel
        .find({
          status: BUY_PLAN_STATUS.ACTIVE,
          subscriptionExpiryDate: { $lt: now },
        })
        .exec();

      this.logger.log(
        `Found ${expiredPlans.length} expired subscriptions to process`,
      );

      // Process each expired plan
      for (const plan of expiredPlans) {
        try {
          // Mark the expired plan as inactive
          await this.buyPlanModel.findByIdAndUpdate(plan._id, {
            status: BUY_PLAN_STATUS.CANCELLED,
            updatedAt: new Date(),
          });

          // Find a free plan
          const freePlan = await this.subscriptionPlanService.findFreePlan();

          if (!freePlan) {
            this.logger.error('No free plan found to assign to user');
            return;
          }

          // Assign free plan to the user
          try {
            await this.buyPlanService.create(
              { subscriptionPlanId: freePlan._id.toString() },
              plan.userId.toString(),
            );
            this.logger.log(`Assigned free plan to user ${plan.userId}`);
          } catch (error: unknown) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            const stack = error instanceof Error ? error.stack : undefined;
            this.logger.error(
              `Failed to assign free plan to user ${plan.userId}: ${errorMessage}`,
              stack,
            );
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          const stack = error instanceof Error ? error.stack : undefined;
          this.logger.error(
            `Error processing subscription for user ${plan.userId}: ${errorMessage}`,
            stack,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in handleExpiredSubscriptions:', error);
    }
  }
}
