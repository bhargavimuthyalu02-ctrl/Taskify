import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id?: number;
  type: ToastType;
  message: string;
  title?: string;
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messagesSubject = new Subject<ToastMessage>();
  private idCounter = 1;

  messages$: Observable<ToastMessage> = this.messagesSubject.asObservable();

  show(message: string, type: ToastType = 'info', title?: string, timeoutMs = 5000) {
    const msg = { id: this.idCounter++, message, type, title, timeoutMs };
    console.log('[ToastService] Emitting message:', msg);
    this.messagesSubject.next(msg);
  }

  showError(message: string, title?: string, timeoutMs = 6000) {
    this.show(message, 'error', title, timeoutMs);
  }

  showWarning(message: string, title?: string, timeoutMs = 5000) {
    this.show(message, 'warning', title, timeoutMs);
  }

  showSuccess(message: string, title?: string, timeoutMs = 4000) {
    this.show(message, 'success', title, timeoutMs);
  }

  showInfo(message: string, title?: string, timeoutMs = 4000) {
    this.show(message, 'info', title, timeoutMs);
  }
}
