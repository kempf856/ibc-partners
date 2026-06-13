import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageResponse } from '../../page-response';
import { PartnerDto } from './partner-dto';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  constructor(private http: HttpClient) {}

  save(req: PartnerDto) {
    if (req.id) {
      return this.http.put(`/api/partners/${req.id}`, req);
    } else {
      return this.http.post('/api/partners', req);
    }
  }

  getById(id: string) {
    return this.http.get<PartnerDto>(`/api/partners/${id}`);
  }

  search(req: { page: number; size: number; sort?: string; name?: string; address?: string; activities?: number[] }) {
    const params: any = {
      page: req.page,
      size: req.size,
      ...(req.sort ? { sort: req.sort } : {}),
      ...(req.name ? { name: req.name } : {}),
      ...(req.address ? { address: req.address } : {}),
    };

    if (req.activities && req.activities.length > 0) {
      params.activities = req.activities.join(',');
    }

    return this.http.get<PageResponse<PartnerDto>>('/api/partners', { params });
  }
}
