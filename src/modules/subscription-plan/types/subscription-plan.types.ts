import { Document, Types } from 'mongoose';

export interface SubscriptionPlanDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionPlanDto {
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanDto
  extends Partial<CreateSubscriptionPlanDto> {}

export interface SubscriptionPlanQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
