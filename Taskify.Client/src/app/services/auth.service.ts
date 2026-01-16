import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, switchMap } from 'rxjs';
import { CryptoService } from './crypto.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private crypto = inject(CryptoService);
  // Hardcoded API base to ensure correct endpoint
  private base = 'https://localhost:7292';

  private loggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('taskify_token'));

  login(email: string, password: string) {
    console.log('AuthService login called with:', {base: this.base});
    // Hash password before sending to API
    return from(this.crypto.hashPassword(password)).pipe(
      switchMap(hashedPassword => 
        this.http.post<{ token: string }>(`${this.base}/api/Users/login`, { userEmail: email, password: hashedPassword })
      )
    );
  }

  register(email: string, password: string, role: string) {
    // Hash password before sending to API
    return from(this.crypto.hashPassword(password)).pipe(
      switchMap(hashedPassword => 
        this.http.post(`${this.base}/api/Users/register`, { userEmail: email, password: hashedPassword, role })
      )
    );
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
