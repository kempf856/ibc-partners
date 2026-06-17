import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommissionDto} from './commission-dto';
import {PageResponse} from '../../../../page-response';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  http = inject(HttpClient);

  getCommissions(req: {
    page: number;
    size: number;
    sort: string;
    userId?: number;
    transactionId?: number;
  }) {
    return this.http.get<PageResponse<CommissionDto>>('/api/commissions', {
      params: req
    });
   }
}
