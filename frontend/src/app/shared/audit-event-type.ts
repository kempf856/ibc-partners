export enum AuditEventType {
  COMMISSION_SETTING_CHANGED = 'COMMISSION_SETTING_CHANGED'
}

export const AUDIT_EVENT_TYPE_LABELS: Record<AuditEventType, string> = {
  [AuditEventType.COMMISSION_SETTING_CHANGED]: 'Jutalék beállítás módosult',
};

export function auditEventTypeLabel(auditEventType?: AuditEventType): string {
  if (!auditEventType) return '';
  return AUDIT_EVENT_TYPE_LABELS[auditEventType];
}

export const AUDIT_EVENT_FIELD_LABELS: Record<AuditEventType, Record<string, string>> = {
  [AuditEventType.COMMISSION_SETTING_CHANGED]: {
    sellerPercent: 'Partneri jutalék',
    buyerPercent: 'Vevő kedvezmény',
    director1Id: 'Direktor 1',
    director1Percent: 'Direktor 1 jutalék',
    director2Id: 'Direktor 2',
    director2Percent: 'Direktor 2 jutalék',
    director3Id: 'Direktor 3',
    director3Percent: 'Direktor 3 jutalék',
    referralId: 'Üzletkötő',
    referralPercent: 'Üzletkötői jutalék'
  }
};

export function auditEventFieldLabel(eventType: AuditEventType, field: string): string {
  return AUDIT_EVENT_FIELD_LABELS[eventType]?.[field] ?? field;
}

