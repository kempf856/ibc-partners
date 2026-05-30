import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {UserDto} from './user-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(req: {
    page: number;
    size: number;
    sort?: string;
    email?: string;
    fullName?: string;
    role?: string;
  }) {
    return this.http.get<PageResponse<UserDto>>('/api/users', {
      params: {
        page: req.page,
        size: req.size,
        ...(req.sort ? { sort: req.sort } : {}),
        ...(req.email ? { email: req.email } : {}),
        ...(req.fullName ? { fullName: req.fullName } : {}),
        ...(req.role ? { role: req.role } : {})
      }
    });
  }
}
