export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
  PARTNER = 'PARTNER'
}

export const ALL_ROLES = [
  Role.ADMIN,
  Role.PARTNER,
  Role.SALES
];

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Direktor',
  [Role.PARTNER]: 'Partner',
  [Role.SALES]: 'Üzletkötő'
};

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role];
}
