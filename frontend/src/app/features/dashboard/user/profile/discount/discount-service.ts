import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DiscountDto} from './discount-dto';
import {PageResponse} from '../../../../page-response';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
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

    return this.http.get<PageResponse<DiscountDto>>('/api/discounts/my', { params });
  }

  getDiscounts(req: {
    page: number;
    size: number;
    sort: string;
    sellerId?: number;
    buyerId?: number;
  }) {
    return this.http.get<PageResponse<DiscountDto>>('/api/discounts', {
      params: req
    });
   }
}
