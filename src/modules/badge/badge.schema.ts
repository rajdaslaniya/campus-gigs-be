import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BadgeDocument = Badge & Document;

@Schema({ timestamps: true })
export class Badge {
  @Prop({ required: true, minlength: 2, maxlength: 40, unique: true })
  name: string;

  @Prop({ required: true, minlength: 2, maxlength: 100 })
  description: string;

  @Prop({ default: false })
  isDeleted?: boolean;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
