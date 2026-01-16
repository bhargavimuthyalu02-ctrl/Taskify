import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, timer } from 'rxjs';
import { ToastMessage, ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <div class="app-toast" *ngFor="let t of toasts"
           [class.app-toast-error]="t.type==='error'"
           [class.app-toast-success]="t.type==='success'"
           [class.app-toast-warning]="t.type==='warning'"
           [class.app-toast-info]="t.type==='info'"
           role="alert">
        <div class="app-toast-header" *ngIf="t.title">{{t.title}}</div>
        <div class="app-toast-body">{{t.message}}</div>
        <button class="app-toast-close" (click)="dismiss(t.id!)" type="button">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    /* Avoid Bootstrap .toast conflicts by using a namespaced class */
    .app-toast {
      position: relative;
      min-width: 280px;
      max-width: 450px;
      padding: 15px 40px 15px 15px;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
      color: #222;
      background: #fff;
      border: 1px solid #ddd;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      opacity: 1 !important;
      display: block !important;
      visibility: visible !important;
    }
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .app-toast-header {
      font-weight: 700;
      margin-bottom: 8px;
      font-size: 1rem;
    }
    .app-toast-body {
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .app-toast-close {
      position: absolute;
      top: 8px;
      right: 10px;
      background: transparent;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      line-height: 1;
    }
    .app-toast-close:hover { color: #333; }
    .app-toast-error { border-left: 5px solid #e74c3c; }
    .app-toast-success { border-left: 5px solid #27ae60; }
    .app-toast-warning { border-left: 5px solid #f39c12; }
    .app-toast-info { border-left: 5px solid #3498db; }
  `]
})
export class ToastComponent implements OnDestroy {
  toasts: ToastMessage[] = [];
  private sub: Subscription;

  constructor(private toast: ToastService) {
    console.log('[ToastComponent] Constructor called');
    this.sub = this.toast.messages$.subscribe(msg => {
      console.log('[ToastComponent] Received message:', msg);
      this.toasts = [...this.toasts, msg];
      console.log('[ToastComponent] Current toasts:', this.toasts);
      console.log('[ToastComponent] Toasts length:', this.toasts.length);
      const timeout = msg.timeoutMs ?? 5000;
      timer(timeout).subscribe(() => this.dismiss(msg.id!));
    });
  }

  dismiss(id: number) {
    console.log('[ToastComponent] Dismissing toast:', id);
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() {
    console.log('[ToastComponent] Destroyed');
    this.sub.unsubscribe();
  }
}
