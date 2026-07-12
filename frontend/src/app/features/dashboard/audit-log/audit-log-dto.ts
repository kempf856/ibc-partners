import {AuditEventType} from '../../../shared/audit-event-type';
import {AuditChangeDto} from './audit-change-dto';

export interface AuditLogDto {
  id: number;
  eventType: AuditEventType;
  entityType: string;
  entityId: number;
  description: string;
  before: unknown;
  after: unknown;
  changes: AuditChangeDto[];
  createdBy: number;
  createdByName: string;
  createdAt: string;
}
