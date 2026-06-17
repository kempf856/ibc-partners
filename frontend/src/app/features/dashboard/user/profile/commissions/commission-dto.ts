import {CommissionStatus} from '../../../../../shared/commission-status';

export interface CommissionDto {
  id: number;
  transactionId: number;
  userId: number;
  userName: string;
  sellerName: string;
  description: string | null;
  fulfillmentDate: string | null;
  amount: number;
  commission: number;
  status: CommissionStatus;
}
