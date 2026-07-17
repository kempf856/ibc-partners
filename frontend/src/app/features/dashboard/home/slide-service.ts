import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DashboardDto} from './dashboard-dto';
import {SlideDto} from './slide-dto';
import {PageResponse} from '../../page-response';

@Injectable({
  providedIn: 'root',
})
export class SlideService {

  http = inject(HttpClient);

  save(slideDto: SlideDto) {
    if (slideDto.id) {
      return this.http.put(`/api/slides/${slideDto.id}`, slideDto);
    } else {
      return this.http.post('/api/slides', slideDto);
    }
  }

  delete(id: number) {
    return this.http.delete(`/api/slides/${id}`);
  }

  getById(id: number) {
    return this.http.get<SlideDto>(`/api/slides/${id}`);
  }

  search(req: { page: number; size: number; sort: string; active?: boolean }) {
    return this.http.get<PageResponse<SlideDto>>('/api/slides', {
      params: {
        page: req.page,
        size: req.size,
        sort: req.sort,
        ...(req.active ? { active: req.active } : {}),
      }
    });
  }

  getAllVisible() {
    return this.http.get<SlideDto[]>('/api/slides/all-visible');
  }
}
