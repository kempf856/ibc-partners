export interface PartnerDto {
  id: number;
  taxNumber: string;
  name: string;
  headquarters: string;
  site: string | null;
  phone: string | null;
  website: string | null;
  activities: number[];
  keyWords: string | null;
  introduction: string | null;
}
