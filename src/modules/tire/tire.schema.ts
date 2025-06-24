import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Tire extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'GigsCategory' }],
    required: true,
  })
  categories: string[];

  @Prop({ type: Boolean, default: false })
  isUsed: boolean;
}

export const tireSchema = SchemaFactory.createForClass(Tire);

export const TIRE_MODEL = Tire.name;
