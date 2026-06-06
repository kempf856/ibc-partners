export interface ApplicationRequest {
  email: string;
  fullName: string;
  phone: string;
  companyName: string,
  taxNumber: string,
  source: string,
  referralCode?: string
}
