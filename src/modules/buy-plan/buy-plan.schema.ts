import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BUY_PLAN_STATUS } from 'src/utils/enums';

export type BuyPlanDocument = BuyPlan & Document;

@Schema({ timestamps: true, collection: 'buyplans' })
export class BuyPlan extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'SubscriptionPlan',
  })
  subscriptionPlanId: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
    min: 0,
  })
  price: number;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(BUY_PLAN_STATUS),
    default: BUY_PLAN_STATUS.ACTIVE,
  })
  status: BUY_PLAN_STATUS;

  @Prop({
    type: Date,
    required: false,
    index: { expires: 0 }, // TTL index
  })
  subscriptionExpiryDate?: Date;
}

export const BuyPlanSchema = SchemaFactory.createForClass(BuyPlan);
