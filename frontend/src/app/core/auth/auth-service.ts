import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {Role} from '../../shared/role';
import {ApplicationRequest} from '../../features/auth/application/application-request';
import {ForgottanPasswordRequest} from '../../features/auth/forgotten-password/forgotten-password-request';
import {ActivePartnerService} from './active-partner-service';

interface JwtPayload {
  sub: string;
  roles: Role[];
  exp: number;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  activePartnerService = inject(ActivePartnerService);

  private tokenKey = 'myIBCtoken';
  private router = inject(Router)

  private token: string | null = null;
  private roles: Role[] = [];
  private exp: number = 0;
  private userId: number | null = null;

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
    this.userId = decoded.userId ?? null;
    this.activePartnerService.loadActivePartners();
  }

  register(otp: string, password: string) {
    return this.http.post<any>('/api/auth/register', {
      otp,
      password
    });
  }

  application(request: ApplicationRequest) {
    return this.http.post<any>('/api/auth/application', request);
  }

  forgottenPassword(request: ForgottanPasswordRequest) {
    return this.http.post<any>('/api/auth/forgotten-password', request);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: Role): boolean {
    return this.roles.includes(role) ?? false;
  }

  hasAnyRole(...roles: Role[]): boolean {
    return roles.some(r => this.roles.includes(r));
  }

  getLoggedInUser() {
    return this.userId;
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
    this.token = null;
    this.roles = [];
    this.exp = 0;
    this.router.navigate(['/public/login']);
  }
}
