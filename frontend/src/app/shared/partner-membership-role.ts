export enum PartnerMembershipRole {
  OWNER = 'OWNER',
  EMPLOYEE = 'EMPLOYEE'
}

export const MEMBERSHIP_LABELS: Record<PartnerMembershipRole, string> = {
  [PartnerMembershipRole.OWNER]: 'Tulajdonos',
  [PartnerMembershipRole.EMPLOYEE]: 'Alkalmazott'
};

export function membershipLabel(membershipRole?: PartnerMembershipRole): string {
  if (!membershipRole) return '';
  return MEMBERSHIP_LABELS[membershipRole];
}
