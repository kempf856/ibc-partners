import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../../../page-response';
import {InvoiceDto} from './invoice-dto';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  http = inject(HttpClient);

  my(req: {
    page: number;
    size: number;
    sort: string;
  }) {
    return this.http.get<PageResponse<InvoiceDto>>('/api/invoices/my', {
      params: req
    });
  }

  create(ids: number[]) {
    return this.http.post('/api/invoices', { commissionIds: ids });
  }
}
