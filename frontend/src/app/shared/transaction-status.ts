export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACCOUNTED = 'ACCOUNTED'
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'Függő',
  [TransactionStatus.APPROVED]: 'Jóváhagyott',
  [TransactionStatus.ACCOUNTED]: 'Elszámolt',
};

export function transactionStatusLabel(transactionStatus?: TransactionStatus): string {
  if (!transactionStatus) return '';
  return TRANSACTION_STATUS_LABELS[transactionStatus];
}

export const TRANSACTION_STATUS_CLASSES: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'status-pending-1',
  [TransactionStatus.APPROVED]: 'status-new',
  [TransactionStatus.ACCOUNTED]: 'status-success',
};

export function transactionStatusClass(transactionStatus?: TransactionStatus): string {
  if (!transactionStatus) return '';
  return TRANSACTION_STATUS_CLASSES[transactionStatus];
}
