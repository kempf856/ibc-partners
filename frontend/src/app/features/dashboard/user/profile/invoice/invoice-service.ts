import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../../../page-response';
import {InvoiceDto} from './invoice-dto';
import {InvoiceSummary} from './invoice-summary';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  http = inject(HttpClient);

  search(req: {
    page: number;
    size: number;
    sort: string;
  }, userId: number | null) {
    if (userId) {
      return this.http.get<InvoiceSummary>('/api/invoices', {
        params: {
          ...req,
          userId: userId
        }
      });
    } else {
      return this.http.get<InvoiceSummary>('/api/invoices/my', {
        params: req
      });
    }
  }

  create(ids: number[]) {
    return this.http.post('/api/invoices', { commissionIds: ids });
  }

  getById(id: number, my: boolean) {
    if (my) {
      return this.http.get<InvoiceDto>(`/api/invoices/${id}/my`);
    } else {
      return this.http.get<InvoiceDto>(`/api/invoices/${id}`);
    }
  }
}
