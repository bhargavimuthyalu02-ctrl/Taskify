export interface TaskItem {
  id?: string;
  title: string;
  description?: string;
  dueDate?: string | null; // ISO string
  // API expects numeric enums: 0 = Low/Pending, 1 = Medium/Completed, 2 = High
  priority?: number;
  status?: number;
  ownerEmail?: string;
}
