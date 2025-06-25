import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class GigsCategory extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: "" })
  description: string;

  @Prop({ type: Boolean, default: false })
  isUsed: boolean;
}

export const gigsCategorySchema = SchemaFactory.createForClass(GigsCategory);

export const GIGS_CATEGORY_MODEL = GigsCategory.name;