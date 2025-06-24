import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrivacyPolicyDocument = PrivacyPolicy & Document;

@Schema({ timestamps: true })
export class PrivacyPolicy {
  @Prop({ required: true })
  content: string;
}

export const PrivacyPolicySchema = SchemaFactory.createForClass(PrivacyPolicy); 