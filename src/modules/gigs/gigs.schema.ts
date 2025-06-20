import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Gigs extends Document {
  @Prop({ type: String, required: true })
  title: string;
}

export const GigsSchema = SchemaFactory.createForClass(Gigs);

export const GIGS_MODEL = Gigs.name;
