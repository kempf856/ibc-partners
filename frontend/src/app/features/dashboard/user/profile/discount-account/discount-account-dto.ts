export interface DiscountAccountDto {
  id: number;
  sellerName: string;
  buyerName: string;
  allDiscounts: number;
  availableBalance: number;
  blockedBalance: number;
}
