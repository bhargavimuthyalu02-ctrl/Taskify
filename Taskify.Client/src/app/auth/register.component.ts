import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card p-4">
      <h3 class="mb-3">Register</h3>
      <form (ngSubmit)="submit()">
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input class="form-control" [(ngModel)]="email" name="email" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" name="password" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Role</label>
          <input class="form-control" [(ngModel)]="role" name="role" required />
        </div>
        <button class="btn btn-success">Register</button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  role = '';
  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register(this.email, this.password, this.role).subscribe({ next: () => this.router.navigate(['/login']) });
  }
}
