import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false })
export class GigsCategory extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: "Tire", required: true })
  tire: Types.ObjectId;
}

export const gigsCategorySchema = SchemaFactory.createForClass(GigsCategory);

export const GIGS_CATEGORY_MODEL = GigsCategory.name;