import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TaskItem } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 class="mb-0">Tasks</h3>
            <div class="text-muted">Tasks from server ({{tasks?.length || 0}})</div>
          </div>
          <div>
            <button class="btn btn-primary me-2" (click)="newTask()">New Task</button>
            <button class="btn btn-outline-secondary" (click)="load()">Refresh</button>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-4">Loading…</div>
        <div *ngIf="error" class="alert alert-danger">{{error}}</div>

        <div *ngIf="!loading && tasks?.length">
          <div class="mb-2">
            <div class="row g-2">
              <div class="col">
                <select class="form-select" [(ngModel)]="pendingFilters.priority">
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div class="col">
                <select class="form-select" [(ngModel)]="pendingFilters.status">
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-primary" (click)="applyFilter()">Apply Filter</button>
              <button class="btn btn-secondary" (click)="clearFilter()">Clear Filter</button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-hover align-middle task-table">
              <thead class="table-light">
                <tr>
                  <th>Title</th>
                  <th class="d-none d-md-table-cell">Description</th>
                  <th>Due</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th class="d-none d-md-table-cell">Owner</th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of filteredTasks()">
                  <td>
                    <div class="fw-semibold">{{t.title}}</div>
                  </td>
                  <td class="d-none d-md-table-cell text-truncate" style="max-width:320px">{{t.description}}</td>
                  <td>{{formatDate(t.dueDate)}}</td>
                  <td><span [ngClass]="priorityClass(t.priority)">{{priorityText(t.priority)}}</span></td>
                  <td><span [ngClass]="statusClass(t.status)">{{statusText(t.status)}}</span></td>
                  <td class="d-none d-md-table-cell">{{t.ownerEmail}}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary me-2" (click)="edit(t)">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" (click)="del(t)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div *ngIf="!loading && (!tasks || tasks.length === 0)" class="text-center py-4 text-muted">
          No tasks to display.
        </div>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  loading = false;
  error: string | null = null;
  filters: any = {
    priority: '',
    status: ''
  };
  pendingFilters: any = {
    priority: '',
    status: ''
  };
    applyFilter() {
      this.filters = Object.assign({}, this.pendingFilters);
      this.tasks = [...this.tasks];
    }

    clearFilter() {
      this.pendingFilters = {
        priority: '',
        status: ''
      };
      this.filters = Object.assign({}, this.pendingFilters);
      this.tasks = [...this.tasks];
    }
  filteredTasks(): TaskItem[] {
    return this.tasks.filter(t => {
      let priorityMatch = true;
      if (this.filters.priority) {
        const filterVal = this.filters.priority.toLowerCase();
        const priorityVal = this.priorityText(t.priority).toLowerCase();
        priorityMatch = priorityVal === filterVal;
      }

      let statusMatch = true;
      if (this.filters.status) {
        const filterVal = this.filters.status.toLowerCase();
        const statusVal = this.statusText(t.status).toLowerCase();
        statusMatch = statusVal === filterVal;
      }

      return priorityMatch && statusMatch;
    });
  }

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = null;
    this.api.list().subscribe({
      next: t => { this.tasks = t || []; this.loading = false; },
      error: err => { this.error = (err?.message ?? 'Failed to load tasks'); this.loading = false; }
    });
  }

  newTask() { this.router.navigate(['/tasks/new']); }
  edit(t: TaskItem) { if (t.id) this.router.navigate(['/tasks', t.id]); }
  del(t: TaskItem) { 
    if (!t.id) return;
    if (confirm(`Are you sure you want to delete the task "${t.title}"?`)) {
      this.api.delete(t.id).subscribe(() => this.load());
    }
  }

  formatDate(d?: string | null) {
    if (!d) return '-';
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch {
      return d as any;
    }
  }

  priorityText(p?: any) {
    if (p === 2 || p === 'High') return 'High';
    if (p === 1 || p === 'Medium') return 'Medium';
    return 'Low';
  }

  statusText(s?: any) {
    if (s === 1 || s === 'Completed') return 'Completed';
    return 'Pending';
  }

  priorityClass(p?: any) {
    const txt = this.priorityText(p);
    if (txt === 'High') return 'badge bg-danger';
    if (txt === 'Medium') return 'badge bg-warning text-dark';
    return 'badge bg-secondary';
  }

  statusClass(s?: any) {
    const st = this.statusText(s);
    return st === 'Completed' ? 'badge bg-success' : 'badge bg-info text-dark';
  }
}
