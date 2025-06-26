import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Tire extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  description: string;
}

export const tireSchema = SchemaFactory.createForClass(Tire);

export const TIRE_MODEL = Tire.name;
