import { Types, Document } from 'mongoose';

import { BUY_PLAN_STATUS } from 'src/utils/enums';

export interface IBuyPlan extends Document {
  userId: Types.ObjectId;
  subscriptionPlanId: Types.ObjectId;
  status: BUY_PLAN_STATUS;
  subscriptionExpiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
