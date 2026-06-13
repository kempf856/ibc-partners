import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {PartnerDto} from './partner-dto';
import {PartnerMembershipDto} from './partner-membership-dto';

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

  findByTaxNumber(taxNumber: string) {
    return this.http.get<PartnerDto>('/api/partners/by-tax-number', { params: { taxNumber: taxNumber } })
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

  findMembership(userId?: number, partnerId?: number) {
    const params: any = {
      userId: userId,
      partnerId: partnerId
    }
    return this.http.get<PartnerMembershipDto[]>('/api/partner-memberships', { params });
  }

  saveMembership(dto: PartnerMembershipDto) {
    return this.http.post('/api/partner-memberships', dto);
  }
}
