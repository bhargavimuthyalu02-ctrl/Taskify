import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToastComponent } from './ui/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, AsyncPipe, ToastComponent],
  template: `
    <div class="app-container">
      <nav class="navbar navbar-light bg-white mb-4 shadow-sm rounded">
        <div class="container-fluid d-flex justify-content-between align-items-center">
          <a class="navbar-brand" routerLink="/">Taskify</a>
          <div class="d-flex align-items-center gap-2">
            <a class="nav-link" routerLink="/tasks">Tasks</a>
            <a class="nav-link" routerLink="/login" *ngIf="!(isLoggedIn$ | async)">Login</a>
            <a class="nav-link" routerLink="/register" *ngIf="!(isLoggedIn$ | async)">Register</a>
            <button class="btn btn-danger fw-bold"
              
              (click)="logout()">Logout</button>
            <span class="ms-2 small text-muted" *ngIf="isLoggedIn$ | async">Logged in</span>
            <span class="ms-2 small text-warning" *ngIf="isLoggedIn$ | async">Token: {{auth.getToken()}}</span>
          </div>
        </div>
      </nav>
      <router-outlet></router-outlet>
      <app-toast></app-toast>
    </div>
  `
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;
  isAuthPage = false;
  constructor(public auth: AuthService, private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$();
    this.router.events.subscribe(() => {
      this.isAuthPage = this.router.url === '/login' || this.router.url === '/register';
    });
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
