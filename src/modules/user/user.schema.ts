import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  name: String;

  @Prop({ type: String, required: true, unique: true })
  email: String;

  @Prop({ type: String, required: true })
  password: String;

  @Prop({ type: Boolean })
  isActivate?: String;
}

export const userSchema = SchemaFactory.createForClass(User);

export const USER_MODEL = User.name;
