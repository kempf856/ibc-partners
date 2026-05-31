import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private tokenKey = 'myIBCtoken';
  private router = inject(Router)

  private token: string | null = null;
  private roles: string[] = [];
  private exp: number = 0;

  login(username: string, password: string) {
    return this.http.post<any>('/api/auth/login', {
      username,
      password
    }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this.decodeToken(res.token);
      })
    );
  }

  private decodeToken(token: string) {
    const decoded = jwtDecode<JwtPayload>(token);
    this.exp = decoded.exp ?? 0;
    this.roles = decoded.roles ?? [];
  }

  register(otp: string, password: string) {
    return this.http.post<any>('/api/auth/register', {
      otp,
      password
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role) ?? false;
  }

  hasAnyRole(...roles: string[]): boolean {
    return roles.some(r => this.roles.includes(r));
  }

  isLoggedIn(): boolean {
    if (!this.token) {
      this.token = this.getToken();
      if (this.token) {
        this.decodeToken(this.token);
      } else {
        return false;
      }
    }

    return this.exp * 1000 > Date.now();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  constructor(private http: HttpClient) {}
}
