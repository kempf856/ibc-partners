import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {ApplicationDto} from './application-dto';
import {ApplicationState} from '../../../shared/application-state';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  getApplications(req: {
    states?: ApplicationState[]
    page: number;
    size: number;
    sort?: string
  }) {
    return this.http.get<PageResponse<ApplicationDto>>('/api/applications', {
      params: {
        page: req.page,
        size: req.size,
        ...(req.sort ? { sort: req.sort } : {}),
        ...(req.states ? { states: req.states } : {})
      }
    });
   }

  getApplication(id: string) {
    return this.http.get<ApplicationDto>(`/api/applications/${id}`);
  }

  process(id: string) {
    return this.http.post<ApplicationDto>(`/api/applications/${id}/process`, {});
  }

  accept(id: string) {
    return this.http.post<ApplicationDto>(`/api/applications/${id}/accept`, {});
  }

  deny(id: string) {
    return this.http.post<ApplicationDto>(`/api/applications/${id}/deny`, {});
  }

  comment(id: string, comment: string) {
    return this.http.post<ApplicationDto>(`/api/applications/${id}/comment`, { comment: comment});
  }
}
