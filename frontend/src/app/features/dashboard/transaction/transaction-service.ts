import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {TransactionDto} from './transaction-dto';
import {TransactionRequest} from './transaction-request';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  createTransaction(req: TransactionRequest) {
    return this.http.post('/api/transactions', req);
  }

  getTransactions(req: {
    page: number;
    size: number;
    sort?: string
  }) {
    return this.http.get<PageResponse<TransactionDto>>('/api/transactions', {
      params: {
        page: req.page,
        size: req.size,
        ...(req.sort ? { sort: req.sort } : {}),
      }
    });
   }

  getTransaction(id: number) {
    return this.http.get<TransactionDto>(`/api/transactions/${id}`);
  }

  approveSeller(id: number) {
    return this.http.post(`/api/transactions/${id}/approve-seller`, {});
  }

  approveBuyer(id: number) {
    return this.http.post(`/api/transactions/${id}/approve-buyer`, {});
  }

  book(id: number) {
    return this.http.post(`/api/transactions/${id}/book`, {});
  }
}
