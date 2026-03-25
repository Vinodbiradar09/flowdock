import { TaskPagination } from "@/components/tasks/task-pagination.client";
import { TaskFilters } from "@/components/tasks/task-filters.client";
import { TaskTable } from "@/components/tasks/task-table.client";
import { TaskForm } from "@/components/tasks/task-form.client";
import { CheckSquare } from "@phosphor-icons/react/dist/ssr";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Metadata } from "next";
import type {
  ApiSuccessResponse,
  TaskListResponse,
  TaskPriority,
  TaskStatus,
} from "@/lib/types/task.types";

export const metadata: Metadata = {
  title: "Tasks — Flowdock",
  description: "Manage, filter and track all your tasks in one place",
};

type TasksPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
};

function buildQueryString(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const resolvedParams = await searchParams;

  const page = resolvedParams.page ?? "1";
  const status = resolvedParams.status as TaskStatus | undefined;
  const priority = resolvedParams.priority as TaskPriority | undefined;
  const search = resolvedParams.search;
  const sortBy = resolvedParams.sortBy ?? "createdAt";
  const sortOrder = resolvedParams.sortOrder ?? "desc";

  const qs = buildQueryString({
    page,
    limit: "10",
    status,
    priority,
    search,
    sortBy,
    sortOrder,
  });

  const res = await serverFetch<ApiSuccessResponse<TaskListResponse>>(
    `/api/tasks?${qs}`,
  );

  const tasks = res.data?.items ?? [];
  const meta = res.data?.meta ?? {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <CheckSquare
              size={16}
              weight="fill"
              className="text-muted-foreground"
            />
            <h1 className="text-sm font-mono font-medium text-foreground uppercase tracking-widest">
              Tasks
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {meta.total === 0
              ? "No tasks yet — create your first task to get started"
              : `${meta.total} ${meta.total === 1 ? "task" : "tasks"} in your workspace`}
          </p>
        </div>
        <TaskForm mode="create" />
      </header>

      <main className="flex-1 px-6 py-6 flex flex-col gap-4">
        <TaskFilters
          currentStatus={status}
          currentPriority={priority}
          currentSearch={search}
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
        />
        <TaskTable tasks={tasks} meta={meta} />

        {meta.totalPages > 1 && (
          <TaskPagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
          />
        )}
      </main>
    </div>
  );
}
