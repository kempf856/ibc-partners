import {CommissionDto} from '../commission/commission-dto';

export interface InvoiceDto {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  createdAt: string;
  commissions?: CommissionDto[];
}
