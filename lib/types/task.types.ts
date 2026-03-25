export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TaskListResponse = {
  items: Task[];
  meta: TaskMeta;
};

export type TaskAnalytics = {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  completionRate: number;
};

export type TaskQueryParams = {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T | null;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
