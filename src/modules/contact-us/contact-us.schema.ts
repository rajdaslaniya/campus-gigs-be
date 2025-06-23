import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

    @Prop({ required: true, default: 'pending', enum: ['pending', 'responded'] })
    status: string;
}

export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);
