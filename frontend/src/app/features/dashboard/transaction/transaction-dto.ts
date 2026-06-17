import {TransactionStatus} from '../../../shared/transaction-status';

export interface TransactionDto {
  id: number;
  sellerId: number;
  sellerName: string | null;
  buyerId: number;
  buyerName: string | null;
  invoiceNumber: string | null;
  amount: number;
  description: string | null;
  fulfillmentDate: string | null;
  sellerApproved: string | null;
  buyerApproved: string | null;
  status: TransactionStatus;
}
