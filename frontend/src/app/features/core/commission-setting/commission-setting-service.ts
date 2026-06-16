import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {CommissionSettingDto} from './commission-setting-dto';

@Injectable({
  providedIn: 'root',
})
export class CommissionSettingService {
  constructor(private http: HttpClient) {}

  save(req: CommissionSettingDto) {
    return this.http.put(`/api/commission-settings`, req);
  }

  search(partnerId?: number, transactionId?: number) {
    const params: any = {
      ...(partnerId ? { partnerId } : {}),
      ...(transactionId ? { transactionId } : {}),
    };
    return this.http.get<CommissionSettingDto>('/api/commission-settings', { params });
  }
}
