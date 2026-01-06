import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card p-4">
      <h3 class="mb-3">Login</h3>
      <form (ngSubmit)="submit()">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" [(ngModel)]="email" name="email" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" name="password" required />
        </div>
        <button class="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
    <div class="mt-3 text-center">
      <span>Don't have an account?</span>
      <button type="button" class="btn btn-link p-0 ms-1 align-baseline" (click)="goToRegister()">Register</button>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  constructor(private auth: AuthService, private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  submit() {
    try {
      console.log('Login submit called:', {
        url: `https://localhost:7292/api/Users/login`,
        payload: { userEmail: this.email, password: this.password }
      });
      this.auth.login(this.email, this.password).subscribe({
        next: res => {
          if (res?.token) {
            this.auth.saveToken(res.token);
            this.router.navigate(['/tasks']);
          }
        },
        error: err => {
          console.error('Login error:', err);
        }
      });
    } catch (e) {
      console.error('Login JS error:', e);
    }
  }
}
