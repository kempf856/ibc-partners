import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {ActivityDto} from './activity-dto';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  constructor(private http: HttpClient) {}

  save(req: ActivityDto) {
    if (req.id) {
      return this.http.put(`/api/activities/${req.id}`, req);
    } else {
      return this.http.post('/api/activities', req);
    }
  }

  getById(id: number) {
    return this.http.get<ActivityDto>(`/api/activities/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`/api/activities/${id}`);
  }

  search(req: { page: number; size: number; sort?: string; activity?: string; }) {
    const params: any = {
      page: req.page,
      size: req.size,
      ...(req.sort ? { sort: req.sort } : {}),
      ...(req.activity ? { activity: req.activity } : {}),
    };
    return this.http.get<PageResponse<ActivityDto>>('/api/activities', { params });
  }
}
