import {ApplicationState} from '../../../shared/application-state';

export interface ApplicationDto {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  companyName: string,
  taxNumber: string,
  source: string,
  comment?: string,
  state: ApplicationState,
  salesId?: number,
  salesName?: string,
  referralCode?: string,
  createdAt: string,
  modifiedAt: string
}
