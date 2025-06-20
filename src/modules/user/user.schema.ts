import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ROLE } from 'src/utils/enums';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: ROLE,
    default: ROLE.USER,
  })
  role: ROLE;

  @Prop({ type: Boolean })
  isAgreed: boolean;

  @Prop({ type: String })
  profile?: string;

  @Prop({ type: String })
  professional_interests: string;

  @Prop({ type: String })
  extracurriculars: string;

  @Prop({ type: String })
  certifications: string;

  @Prop({ type: Array<String> })
  skills: string[];

  @Prop({ type: String })
  education: string;

  @Prop({ type: String })
  otp?: string;

  @Prop({ type: Date })
  otp_expiry?: Date;
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

export const USER_MODEL = User.name;
