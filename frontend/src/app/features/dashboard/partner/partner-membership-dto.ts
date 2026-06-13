import {PartnerMembershipRole} from '../../../shared/partner-membership-role';

export interface PartnerMembershipDto {
  id?: number;
  userId: number;
  partnerId: number;
  role: PartnerMembershipRole;
}
