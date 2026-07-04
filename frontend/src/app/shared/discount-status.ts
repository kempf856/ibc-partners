export enum DiscountStatus {
  LISTED = 'LISTED',
  ACCOUNTED = 'ACCOUNTED'
}

export const COMMISSION_STATUS_LABELS: Record<DiscountStatus, string> = {
  [DiscountStatus.LISTED]: 'Felhasználható',
  [DiscountStatus.ACCOUNTED]: 'Felhasznált',
};

export function discountStatusLabel(discountStatus?: DiscountStatus): string {
  if (!discountStatus) return '';
  return COMMISSION_STATUS_LABELS[discountStatus];
}

export const COMMISSION_STATUS_CLASSES: Record<DiscountStatus, string> = {
  [DiscountStatus.LISTED]: 'status-new',
  [DiscountStatus.ACCOUNTED]: 'status-success',
};

export function discountStatusClass(discountStatus?: DiscountStatus): string {
  if (!discountStatus) return '';
  return COMMISSION_STATUS_CLASSES[discountStatus];
}
