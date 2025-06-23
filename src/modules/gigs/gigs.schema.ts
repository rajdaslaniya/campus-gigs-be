import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TIRE_MODEL } from '../tire/tire.schema';

@Schema({ timestamps: true, versionKey: false })
export class Gigs extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true, ref: TIRE_MODEL })
  tire: Types.ObjectId;

  @Prop({ type: Number, required: true })
  price: Number;

  @Prop({ type: Array<String> })
  keywords: String[];

  @Prop({ type: Array<String> })
  certifications: string[];

  @Prop({ type: Array<String> })
  skills: string[];
}

export const gigsSchema = SchemaFactory.createForClass(Gigs);

gigsSchema.pre<Gigs>('save', async function (next) {
  if (!this.isModified('price')) return next();

  try {
    this.price = Number(this.price.toFixed(2))
    next();
  } catch (err) {
    next(err);
  }
});

export const GIGS_MODEL = Gigs.name;
