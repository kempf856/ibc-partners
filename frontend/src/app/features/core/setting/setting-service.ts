import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {SettingDto} from './setting-dto';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) {}

  save(editMode: boolean, req: SettingDto) {
    if (editMode) {
      return this.http.put(`/api/settings/${req.key}`, req);
    } else {
      return this.http.post('/api/settings', req);
    }
  }

  search(req: { page: number; size: number; sort?: string; }) {
    const params: any = {
      page: req.page,
      size: req.size,
      ...(req.sort ? { sort: req.sort } : {}),
    };
    return this.http.get<PageResponse<SettingDto>>('/api/settings', { params });
  }
}
