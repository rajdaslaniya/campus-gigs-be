import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SubscriptionPlan extends Document {
  @Prop({ required: true })
  @Transform(({ value }) => value?.trim())
  name: string;

  @Prop()
  @Transform(({ value }) => value?.trim())
  description: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: Boolean, default: false })
  isPro: boolean;

  @Prop({ type: [String] }) // e.g., ['user', 'provider']
  rolesAllowed: string[];

  @Prop({ type: Number, default: null }) // max gig posts
  maxGigsPerMonth: number | null;

  @Prop({ type: Number, default: null }) // max bids per month
  maxBidsPerMonth: number | null;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: Boolean, default: false })
  canGetBadges: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
