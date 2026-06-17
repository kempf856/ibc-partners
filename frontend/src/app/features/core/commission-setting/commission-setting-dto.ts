export interface CommissionSettingDto {
  id: number,
  partnerId: number | null,
  transactionId: number | null,
  sellerPercent: number,
  buyerPercent: number | null,
  director1Id: number | null,
  director1Percent: number | null,
  director2Id: number | null,
  director2Percent: number | null,
  director3Id: number | null,
  director3Percent: number | null,
  referralId: number | null,
  referralPercent: number | null
}
