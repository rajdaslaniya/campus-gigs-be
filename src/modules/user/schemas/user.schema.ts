import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserSchema {
  @Prop({ type: String, required: true })
  name: String;

  @Prop({ type: String, required: true })
  email: String;

  @Prop({ type: String, required: true })
  password: String;

  @Prop({ type: Boolean })
  isActivate?: String;
}

export const userSchema = SchemaFactory.createForClass(UserSchema);

export const USER_MODEL = UserSchema.name;

export const UserDocument = Document;
