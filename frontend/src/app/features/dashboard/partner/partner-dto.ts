export interface PartnerDto {
  id?: number;
  taxNumber: string;
  name: string;
  headquarters: string;
  site?: string;
  phone?: string;
  website?: string;
  activities: number[];
}
