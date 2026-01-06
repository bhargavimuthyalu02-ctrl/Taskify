import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskItem } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = (window as any).API_BASE || '';

  list() {
    return this.http.get<TaskItem[]>(`${this.base}/api/Tasks`);
  }

  get(id: string) {
    return this.http.get<TaskItem>(`${this.base}/api/Tasks/${id}`);
  }

  create(payload: TaskItem) {
    return this.http.post<TaskItem>(`${this.base}/api/Tasks`, payload);
  }

  update(id: string, payload: TaskItem) {
    return this.http.put<TaskItem>(`${this.base}/api/Tasks/${id}`, payload);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/api/Tasks/${id}`);
  }
}
