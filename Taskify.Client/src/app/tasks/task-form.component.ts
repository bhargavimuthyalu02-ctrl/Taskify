import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TaskItem } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  template: `
<div class="card p-4">
  <h3>{{isNew ? 'New Task' : 'Edit Task'}}</h3>
  <form #taskForm="ngForm" (ngSubmit)="save()" novalidate>
    
    <!-- Title -->
    <div class="mb-3">
      <label class="form-label">Title</label>
      <input 
        class="form-control" 
        [(ngModel)]="task.title" 
        name="title" 
        required 
        minlength="3"
        #title="ngModel"
      />
      <div class="text-danger" *ngIf="title.invalid && title.touched">
        <small *ngIf="title.errors?.['required']">Title is required.</small>
        <small *ngIf="title.errors?.['minlength']">Title must be at least 3 characters.</small>
      </div>
    </div>

    <!-- Description -->
    <div class="mb-3">
      <label class="form-label">Description</label>
      <textarea 
        class="form-control" 
        [(ngModel)]="task.description" 
        name="description"
        maxlength="200"
        #description="ngModel"
      ></textarea>
      <div class="text-danger" *ngIf="description.invalid && description.touched">
        <small *ngIf="description.errors?.['maxlength']">Description cannot exceed 200 characters.</small>
      </div>
    </div>

    <!-- Row -->
    <div class="row">
      <!-- Due Date -->
      <div class="col-md-4 mb-3">
        <label class="form-label">Due Date</label>
        <input 
          type="datetime-local" 
          class="form-control" 
          [(ngModel)]="dueLocal" 
          name="dueLocal" 
          required
          #dueLocalCtrl="ngModel"
        />
        <div class="text-danger" *ngIf="dueLocalCtrl.invalid && dueLocalCtrl.touched">
          <small>Due date is required.</small>
        </div>
      </div>

      <!-- Priority -->
      <div class="col-md-4 mb-3">
        <label class="form-label">Priority</label>
        <select 
          class="form-select" 
          [(ngModel)]="task.priority" 
          name="priority" 
          required
          #priority="ngModel"
        >
          <option [ngValue]="0">Low</option>
          <option [ngValue]="1">Medium</option>
          <option [ngValue]="2">High</option>
        </select>
        <div class="text-danger" *ngIf="priority.invalid && priority.touched">
          <small>Priority is required.</small>
        </div>
      </div>

      <!-- Status -->
      <div class="col-md-4 mb-3">
        <label class="form-label">Status</label>
        <select 
          class="form-select" 
          [(ngModel)]="task.status" 
          name="status" 
          required
          #status="ngModel"
        >
          <option [ngValue]="0">Pending</option>
          <option [ngValue]="1">Completed</option>
        </select>
        <div class="text-danger" *ngIf="status.invalid && status.touched">
          <small>Status is required.</small>
        </div>
      </div>
    </div>

    <!-- Owner Email -->
    <div class="mb-3">
      <label class="form-label">Owner Email</label>
      <input 
        type="email" 
        class="form-control" 
        [(ngModel)]="task.ownerEmail" 
        name="ownerEmail" 
        required 
        email
        #ownerEmail="ngModel"
      />
      <div class="text-danger" *ngIf="ownerEmail.invalid && ownerEmail.touched">
        <small *ngIf="ownerEmail.errors?.['required']">Email is required.</small>
        <small *ngIf="ownerEmail.errors?.['email']">Enter a valid email address.</small>
      </div>
    </div>

    <!-- Buttons -->
    <div class="d-flex gap-2">
      <button class="btn btn-primary" type="submit" [disabled]="taskForm.invalid">Save</button>
      <button class="btn btn-secondary" type="button" (click)="cancel()">Cancel</button>
    </div>
  </form>
</div>
  `
})
export class TaskFormComponent implements OnInit {
  task: TaskItem = { title: '', priority: 0, status: 0 };
  isNew = true;
  dueLocal: string | null = null; // for binding to datetime-local

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isNew = false;
      this.api.get(id).subscribe(t => {
        this.task = t;
        if (t.dueDate) this.dueLocal = this.toLocalInput(t.dueDate);
      });
    }
  }

  save() {
    if (this.dueLocal) {
      this.task.dueDate = new Date(this.dueLocal).toISOString();
    } else {
      this.task.dueDate = null;
    }
    if (this.isNew) {
      this.api.create(this.task).subscribe(() => this.router.navigate(['/tasks']));
    } else if (this.task.id) {
      this.api.update(this.task.id, this.task).subscribe(() => this.router.navigate(['/tasks']));
    }
  }

  cancel() { this.router.navigate(['/tasks']); }

  private toLocalInput(iso?: string | null) {
    if (!iso) return null;
    const dt = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = dt.getFullYear();
    const mm = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const hh = pad(dt.getHours());
    const min = pad(dt.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }
}
