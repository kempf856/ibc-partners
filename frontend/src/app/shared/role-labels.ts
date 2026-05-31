export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Direktor',
  SALES: 'Üzletkötő',
  PARTNER: 'Partner'
};

export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}
