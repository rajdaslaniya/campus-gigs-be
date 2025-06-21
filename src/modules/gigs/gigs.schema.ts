import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Gigs extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true })
  tire: string;
}

export const gigsSchema = SchemaFactory.createForClass(Gigs);

export const GIGS_MODEL = Gigs.name;
