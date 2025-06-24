import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { BUY_PLAN_STATUS } from '../../utils/enums';

export type BuyPlanDocument = BuyPlan & Document;

@Schema({ timestamps: true })
export class BuyPlan {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
  })
  subscriptionPlanId: string;

  @Prop({
    required: true,
    default: BUY_PLAN_STATUS.ACTIVE,
    enum: [BUY_PLAN_STATUS.ACTIVE, BUY_PLAN_STATUS.INACTIVE],
  })
  status: string;

  @Prop({})
  subscriptionExpiryDate: Date;
}

export const BuyPlanSchema = SchemaFactory.createForClass(BuyPlan);
