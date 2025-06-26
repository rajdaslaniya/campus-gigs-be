import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TIRE_MODEL } from '../tire/tire.schema';
import { USER_MODEL } from '../user/user.schema';
import { PAYMENT_TYPE, PROFILE_TYPE } from 'src/utils/enums';
import { GIGS_CATEGORY_MODEL } from '../gigscategory/gigscategory.schema';

@Schema({ timestamps: true, versionKey: false })
export class Gigs extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: USER_MODEL })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: "" })
  image: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, required: true, ref: TIRE_MODEL })
  tire: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: GIGS_CATEGORY_MODEL })
  gig_category: Types.ObjectId;

  @Prop({ type: String, enum: PAYMENT_TYPE })
  payment_type: PAYMENT_TYPE

  @Prop({ type: Number, required: true })
  price: Number;

  @Prop({ type: Array<String> })
  keywords: String[];

  @Prop({ type: Array<String> })
  certifications: string[];

  @Prop({ type: Array<String> })
  skills: string[];

  @Prop({ type: String, enum: PROFILE_TYPE, required: true })
  profile_type: String;

  @Prop({ type: Date, required: true })
  start_date_time: Date;

  @Prop({ type: Date, required: true })
  end_date_time: Date;
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
