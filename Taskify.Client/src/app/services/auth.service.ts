import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  // Hardcoded API base to ensure correct endpoint
  private base = 'https://localhost:7292';

  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('taskify_token'));

  login(email: string, password: string) {
    console.log('AuthService login called with:', {base: this.base});
    return this.http.post<{ token: string }>(`${this.base}/api/Users/login`, { userEmail: email, password });
  }

  register(email: string, password: string, role: string) {
    return this.http.post(`${this.base}/api/Users/register`, { userEmail: email, password, role });
  }

  saveToken(token: string) {
    localStorage.setItem('taskify_token', token);
    this.loggedIn$.next(true);
  }
  getToken() { return localStorage.getItem('taskify_token'); }
  logout() {
    localStorage.removeItem('taskify_token');
    this.loggedIn$.next(false);
  }
  isLoggedIn$() { return this.loggedIn$.asObservable(); }
}
