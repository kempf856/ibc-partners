export enum CommissionStatus {
  LISTED = 'LISTED',
  INVOICED = 'INVOICED',
  ACCOUNTED = 'ACCOUNTED'
}

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  [CommissionStatus.LISTED]: 'Számlázható',
  [CommissionStatus.INVOICED]: 'Számlázott',
  [CommissionStatus.ACCOUNTED]: 'Elszámolt',
};

export function commissionStatusLabel(commissionStatus?: CommissionStatus): string {
  if (!commissionStatus) return '';
  return COMMISSION_STATUS_LABELS[commissionStatus];
}

export const COMMISSION_STATUS_CLASSES: Record<CommissionStatus, string> = {
  [CommissionStatus.LISTED]: 'status-new',
  [CommissionStatus.INVOICED]: 'status-pending-1',
  [CommissionStatus.ACCOUNTED]: 'status-success',
};

export function commissionStatusClass(commissionStatus?: CommissionStatus): string {
  if (!commissionStatus) return '';
  return COMMISSION_STATUS_CLASSES[commissionStatus];
}
