import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommissionDto} from './commission-dto';
import {PageResponse} from '../../../../page-response';
import {CommissionStatus} from '../../../../../shared/commission-status';
import {CommissionSummary} from './commission-summary';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  http = inject(HttpClient);

  commissionChanged = signal(false);

  search(req: {
    page: number;
    size: number;
    sort: string;
    status?: CommissionStatus;
  }, userId: number | null) {
    const params = {
      page: req.page,
      size: req.size,
      sort: req.sort,
      ...(req.status ? { status: req.status } : {})
    }
    if (userId) {
      return this.http.get<CommissionSummary>('/api/commissions', {
        params: {
          ...params,
          userId: userId
        }
      });
    } else {
      return this.http.get<CommissionSummary>('/api/commissions/my', {
        params: params
      });
    }
  }
}
