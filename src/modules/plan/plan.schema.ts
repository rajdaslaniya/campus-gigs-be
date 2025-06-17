import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Plan extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  price: string;

  @Prop({ type: String, required: true, select: true })
  features: string[];
}

export const planSchema = SchemaFactory.createForClass(Plan);

export const PLAN_MODEL = Plan.name;
