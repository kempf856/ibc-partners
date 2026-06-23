import {Injectable} from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {PartnerDto} from './partner-dto';
import {PartnerMembershipDto} from './partner-membership-dto';
import {SKIP_ERROR} from '../../../core/notification/error-interceptor';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  constructor(private http: HttpClient) {}

  save(req: PartnerDto, referralCode?: string) {
    if (req.id) {
      return this.http.put(`/api/partners/${req.id}`, req);
    } else {
      return this.http.post('/api/partners', req, {
        params: referralCode ? { referralCode: referralCode } : {}
      });
    }
  }

  getById(id: string) {
    return this.http.get<PartnerDto>(`/api/partners/${id}`);
  }

  findByTaxNumber(taxNumber: string, skipNotFound?: boolean) {
    return this.http.get<PartnerDto>('/api/partners/by-tax-number', {
      params: { taxNumber: taxNumber },
      context: new HttpContext().set(SKIP_ERROR, skipNotFound ?? false)
    })
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

  getAll() {
    return this.http.get<PartnerDto[]>('/api/partners/all');
  }

  findMembership(userId?: number | string, partnerId?: number | string) {
    const params: any = {}
    if (userId) {
      params.userId = userId;
    }
    if (partnerId) {
      params.partnerId = partnerId;
    }
    return this.http.get<PartnerMembershipDto[]>('/api/partner-memberships', { params });
  }

  saveMembership(dto: PartnerMembershipDto) {
    return this.http.post('/api/partner-memberships', dto);
  }

  deleteMembership(id: number) {
    return this.http.delete(`/api/partner-memberships/${id}`);
  }
}
