import type {
  ApiResponse,
  CreateTaskInput,
  TaskAnalytics,
  TaskListResponse,
  TaskQueryParams,
  UpdateTaskInput,
} from "@/lib/types/task.types";

const buildQueryString = (params: TaskQueryParams): string => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.priority) query.set("priority", params.priority);
  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
  return query.toString();
};

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();
  return data as ApiResponse<T>;
}

export const taskApi = {
  list: (
    params: TaskQueryParams = {},
  ): Promise<ApiResponse<TaskListResponse>> => {
    const qs = buildQueryString(params);
    return apiFetch<TaskListResponse>(`/api/tasks${qs ? `?${qs}` : ""}`);
  },

  create: (input: CreateTaskInput): Promise<ApiResponse<unknown>> => {
    return apiFetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  update: (
    taskId: string,
    input: UpdateTaskInput,
  ): Promise<ApiResponse<unknown>> => {
    return apiFetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  delete: (taskId: string): Promise<ApiResponse<unknown>> => {
    return apiFetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
  },

  analytics: (): Promise<ApiResponse<TaskAnalytics>> => {
    return apiFetch<TaskAnalytics>("/api/tasks/analytics");
  },
};
