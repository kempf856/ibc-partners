import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Dashboard {

  welcome() {
    return this.http.get('/api/dashboard', {
      responseType: 'text'
    });
  }

  constructor(private http: HttpClient) {}
}
