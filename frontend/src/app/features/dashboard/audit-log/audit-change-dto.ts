import {DisplayType} from '../../../shared/display-type';

export interface AuditChangeDto {
  field: string;
  oldValue: string | null;
  newValue: string | null;
  displayType: DisplayType;
}
