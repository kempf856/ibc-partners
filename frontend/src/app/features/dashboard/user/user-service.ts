import { Injectable } from '@angular/core';
import {HttpClient, HttpContext} from '@angular/common/http';
import {PageResponse} from '../../page-response';
import {UserDto} from './user-dto';
import {SKIP_ERROR} from '../../../core/notification/error-interceptor';

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

  createUser(userDto: UserDto) {
    return this.http.post('/api/users', userDto);
  }

  profile() {
    return this.http.get<UserDto>('/api/users/profile')
  }

  findByEmail(email: string, skipNotFound?: boolean) {
    return this.http.get<UserDto>('/api/users/by-email', {
      params: { email: email },
      context: new HttpContext().set(SKIP_ERROR, skipNotFound ?? false)
    })
  }
}
