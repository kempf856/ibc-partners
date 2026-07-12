import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {AuditLogDto} from './audit-log-dto';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private http = inject(HttpClient);

  search(req: {
    page: number;
    size: number;
    sort?: string;
  }) {
    return this.http.get<PageResponse<AuditLogDto>>('/api/audit-logs', {
      params: {
        page: req.page,
        size: req.size,
        ...(req.sort ? { sort: req.sort } : {}),
      }
    });
   }
}
