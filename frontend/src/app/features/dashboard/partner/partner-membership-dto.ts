import {PartnerMembershipRole} from '../../../shared/partner-membership-role';

export interface PartnerMembershipDto {
  id?: number;
  userId: number;
  userName: string;
  partnerId: number;
  partnerName: string;
  role: PartnerMembershipRole;
}
