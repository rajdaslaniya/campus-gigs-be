import { Document } from 'mongoose';

export interface Badge extends Document {
  name: string;
  description: string;
  isDeleted: boolean;
}
