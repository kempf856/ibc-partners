export interface TransactionRequest {
  sellerId: number;
  buyerId: number;
  invoiceNumber: string | null;
  amount: number;
  discount: number;
  description: string | null;
  fulfillmentDate: string | null;
}
