import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DashboardDto} from './dashboard-dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  http = inject(HttpClient);

  welcome() {
    return this.http.get<DashboardDto>('/api/dashboard');
  }
}
