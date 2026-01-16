import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toast: ToastService,
    private router: Router,
    private auth: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized specifically
        if (error.status === 401) {
          this.toast.showError('Unauthorized access. Please login again.', 'Authentication Error');
          this.auth.logout();
          this.router.navigate(['/login']);
          return throwError(() => error);
        }

        let message = 'Unexpected error';
        // Common ASP.NET Core error shapes
        // 1) string body
        // 2) { message: string }
        // 3) ProblemDetails { title, detail }
        // 4) Validation errors { errors: { field: [messages] } }
        const e = error?.error;
        if (typeof e === 'string') {
          message = e;
        } else if (e && typeof e === 'object') {
          if (e.message) {
            message = e.message;
          } else if (e.detail) {
            message = e.detail;
          } else if (e.title) {
            message = e.title;
          } else if (e.errors && typeof e.errors === 'object') {
            const firstKey = Object.keys(e.errors)[0];
            const firstMsg = Array.isArray(e.errors[firstKey]) ? e.errors[firstKey][0] : e.errors[firstKey];
            message = firstMsg || 'Validation error';
          }
        }
        if (!message || message === 'Unexpected error') {
          if (error.status === 0) {
            message = 'Network error or CORS blocked';
          } else if (error.status) {
            message = `${error.status} ${error.statusText || 'Error'}`;
          }
        }
        // Debug log to help trace issues in dev
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.error('[ErrorInterceptor]', { url: req.url, error });
        }
        this.toast.showError(message);
        return throwError(() => error);
      })
    );
  }
}
