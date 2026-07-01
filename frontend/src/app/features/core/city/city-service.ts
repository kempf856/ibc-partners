import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {CityDto} from './city-dto';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  constructor(private http: HttpClient) {}

  save(req: CityDto) {
    if (req.id) {
      return this.http.put(`/api/cities/${req.id}`, req);
    } else {
      return this.http.post('/api/cities', req);
    }
  }

  getById(id: number) {
    return this.http.get<CityDto>(`/api/cities/${id}`);
  }

  delete(id: number) {
    return this.http.delete(`/api/cities/${id}`);
  }

  search(req: { page: number; size: number; sort?: string; }) {
    const params: any = {
      page: req.page,
      size: req.size,
      ...(req.sort ? { sort: req.sort } : {}),
    };
    return this.http.get<PageResponse<CityDto>>('/api/cities', { params });
  }

  getAll() {
    return this.http.get<CityDto[]>('/api/cities/all');
  }
}
