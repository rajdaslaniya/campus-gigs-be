import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CONTACT_US_STATUS } from '../../utils/enums';

export type ContactUsDocument = ContactUs & Document;

@Schema({ timestamps: true })
export class ContactUs {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true})
    subject: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, default: CONTACT_US_STATUS.PENDING, enum: [CONTACT_US_STATUS.PENDING, CONTACT_US_STATUS.RESPONDED] })
    status: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
