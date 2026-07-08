import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {TransactionDto} from './transaction-dto';
import {TransactionRequest} from './transaction-request';
import {AuthService} from '../../../core/auth/auth-service';
import {Role} from '../../../shared/role';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  createTransaction(req: TransactionRequest, my: boolean) {
    if (my) {
      return this.http.post('/api/transactions/my', req);
    } else {
      return this.http.post('/api/transactions', req);
    }
  }

  getTransactions(req: {
    page: number;
    size: number;
    sort?: string;
  }) {
    return this.http.get<PageResponse<TransactionDto>>('/api/transactions', {
      params: {
        page: req.page,
        size: req.size,
        ...(req.sort ? { sort: req.sort } : {}),
      }
    });
   }

  my(req: {
    page: number;
    size: number;
    sort?: string;
    partnerId: number;
  }) {
    return this.http.get<PageResponse<TransactionDto>>('/api/transactions/my', {
      params: {
        page: req.page,
        size: req.size,
        ...(req.sort ? { sort: req.sort } : {}),
        partnerId: req.partnerId
      }
    });
  }

  getTransaction(id: number) {
    if (this.authService.hasRole(Role.ADMIN)) {
      return this.http.get<TransactionDto>(`/api/transactions/${id}`);
    } else {
      return this.http.get<TransactionDto>(`/api/transactions/${id}/my`);
    }
  }

  approveSeller(id: number, my: boolean) {
    if (my) {
      return this.http.post(`/api/transactions/${id}/approve-seller/my`, {});
    } else {
      return this.http.post(`/api/transactions/${id}/approve-seller`, {});
    }
  }

  approveBuyer(id: number, my: boolean) {
    if (my) {
      return this.http.post(`/api/transactions/${id}/approve-buyer/my`, {});
    } else {
      return this.http.post(`/api/transactions/${id}/approve-buyer`, {});
    }
  }

  book(id: number) {
    return this.http.post(`/api/transactions/${id}/book`, {});
  }
}
