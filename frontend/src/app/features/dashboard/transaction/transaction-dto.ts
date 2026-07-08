import {TransactionStatus} from '../../../shared/transaction-status';

export interface TransactionDto {
  id: number;
  sellerId: number;
  sellerName: string | null;
  buyerId: number;
  buyerName: string | null;
  invoiceNumber: string | null;
  amount: number;
  discount: number;
  description: string | null;
  fulfillmentDate: string | null;
  sellerApproved: string | null;
  sellerApprover: number | null;
  sellerApproverName: string | null;
  buyerApproved: string | null;
  buyerApprover: number | null;
  buyerApproverName: string | null;
  status: TransactionStatus;
  createdAt: string;
  modifiedAt: string;
}
