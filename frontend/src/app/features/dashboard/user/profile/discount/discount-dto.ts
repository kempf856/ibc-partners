import {CommissionStatus} from '../../../../../shared/commission-status';

export interface DiscountDto {
  id: number;
  transactionId: number;
  userId: number;
  userName: string;
  sellerName: string;
  buyerName: string;
  description: string | null;
  fulfillmentDate: string | null;
  amount: number;
  discount: number;
  status: CommissionStatus;
}
