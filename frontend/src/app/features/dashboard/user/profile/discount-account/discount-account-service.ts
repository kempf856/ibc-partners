import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DiscountAccountDto} from './discount-account-dto';
import {PageResponse} from '../../../../page-response';

@Injectable({
  providedIn: 'root',
})
export class DiscountAccountService {
  http = inject(HttpClient);

  my(req: {
    page: number;
    size: number;
    sort: string;
    buyerId: number | null;
    sellerId: number | null;
  }) {
    const params: Record<string, string | number> = {
      page: req.page,
      size: req.size,
      sort: req.sort,
    };

    if (req.buyerId !== null) {
      params['buyerId'] = req.buyerId;
    }

    if (req.sellerId !== null) {
      params['sellerId'] = req.sellerId;
    }

    return this.http.get<PageResponse<DiscountAccountDto>>('/api/discount-accounts/my', { params });
  }

  myByPartner(req: {
    buyerId: number;
    sellerId: number;
  }, my: boolean) {
    if (my) {
      return this.http.get<DiscountAccountDto>('/api/discount-accounts/my/by-partner', { params: req });
    } else {
      return this.http.get<DiscountAccountDto>('/api/discount-accounts/by-partner', { params: req });
    }
  }
}
