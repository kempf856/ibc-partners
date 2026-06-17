export interface TransactionRequest {
  sellerId: number;
  buyerId: number;
  invoiceNumber: string | null;
  amount: number;
  description: string | null;
  fulfillmentDate: string | null;
}
