export interface PartnerDto {
  id: number;
  taxNumber: string;
  name: string;
  headquarters: string;
  site: string | null;
  location: string | null;
  contact: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  activities: number[];
  keyWords: string | null;
  introduction: string | null;
  photo: string | null;
  logo: string | null;
}
