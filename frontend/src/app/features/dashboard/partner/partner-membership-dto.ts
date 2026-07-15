import {PartnerMembershipRole} from '../../../shared/partner-membership-role';

export interface PartnerMembershipDto {
  id?: number;
  userId: number;
  userName: string;
  email: string;
  phone: string;
  partnerId: number;
  partnerName: string;
  role: PartnerMembershipRole;
}
