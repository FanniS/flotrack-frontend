import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import moment from 'moment';
import { LoginRequest } from '../../../shared/models/auth/login-request/login-request';
import { RegisterRequest } from '../../../shared/models/auth/register-request/register-request';
import { AuthResponse } from '../../../shared/models/auth/auth-response/auth-response';
import { Observable } from 'rxjs/internal/Observable';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      environment.apiUrl + '/auth/login',
      credentials,
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      environment.apiUrl + '/auth/register',
      data,
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getCurrentUserEmail() {
    const decodedToken = this.decodeToken();
    return decodedToken ? decodedToken.email : null;
  }

  getExpiration() {
    const decodedToken = this.decodeToken();
    return decodedToken ? moment.unix(decodedToken.exp) : moment(0);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }

  public isLoggedIn() {
    if(moment().isBefore(this.getExpiration())){
      return true;
    }
    else{
      this.logout();
      return false;
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
