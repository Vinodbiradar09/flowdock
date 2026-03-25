import type { Task } from "@/lib/types/task.types";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarBlank,
  CheckSquare,
  Clock,
  Spinner,
} from "@phosphor-icons/react/dist/ssr";

import Link from "next/link";

type RecentTasksProps = {
  tasks: Task[];
};

const statusConfig = {
  TODO: {
    label: "Todo",
    icon: Clock,
    className:
      "rounded-none font-mono text-xs border-border text-muted-foreground bg-transparent",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Spinner,
    className:
      "rounded-none font-mono text-xs border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  DONE: {
    label: "Done",
    icon: CheckSquare,
    className:
      "rounded-none font-mono text-xs border-green-500/30 text-green-400 bg-green-500/10",
  },
};

const priorityConfig = {
  LOW: {
    label: "Low",
    className:
      "rounded-none font-mono text-xs border-border text-muted-foreground bg-transparent",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "rounded-none font-mono text-xs border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  },
  HIGH: {
    label: "High",
    className:
      "rounded-none font-mono text-xs border-red-500/30 text-red-400 bg-red-500/10",
  },
};

function formatDate(date: string | null): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isDueSoon(date: string | null): boolean {
  if (!date) return false;
  const due = new Date(date);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 2;
}

function isOverdue(date: string | null, status: Task["status"]): boolean {
  if (!date || status === "DONE") return false;
  return new Date(date) < new Date();
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  if (tasks.length === 0) {
    return (
      <div className="border border-dashed border-border p-8 flex flex-col items-center justify-center gap-3">
        <CheckSquare size={24} className="text-muted-foreground" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-mono text-foreground">No tasks yet</p>
          <p className="text-xs font-mono text-muted-foreground">
            Create your first task to start tracking your progress
          </p>
        </div>
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-xs font-mono border border-border px-3 py-1.5 hover:bg-muted transition-colors"
        >
          Go to Tasks
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-border">
      <div className="grid grid-cols-12 gap-4 px-4 py-2.5 border-b border-border bg-muted/40">
        <p className="col-span-5 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Title
        </p>
        <p className="col-span-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Status
        </p>
        <p className="col-span-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Priority
        </p>
        <p className="col-span-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Due Date
        </p>
      </div>
      {tasks.map((task, index) => {
        const status = statusConfig[task.status];
        const priority = priorityConfig[task.priority];
        const StatusIcon = status.icon;
        const formattedDate = formatDate(task.dueDate);
        const overdue = isOverdue(task.dueDate, task.status);
        const dueSoon = isDueSoon(task.dueDate);

        return (
          <div
            key={task.id}
            className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            <div className="col-span-5 flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-mono text-muted-foreground shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p
                  className={`text-sm font-mono truncate ${
                    task.status === "DONE"
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </p>
              </div>
              {task.description && (
                <p className="text-xs font-mono text-muted-foreground truncate pl-6">
                  {task.description}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <Badge className={status.className}>
                <StatusIcon size={11} className="mr-1" />
                {status.label}
              </Badge>
            </div>
            <div className="col-span-2">
              <Badge className={priority.className}>{priority.label}</Badge>
            </div>
            <div className="col-span-3 flex items-center gap-1.5">
              {formattedDate ? (
                <>
                  <CalendarBlank
                    size={12}
                    className={
                      overdue
                        ? "text-red-400"
                        : dueSoon
                          ? "text-yellow-400"
                          : "text-muted-foreground"
                    }
                  />
                  <p
                    className={`text-xs font-mono ${
                      overdue
                        ? "text-red-400"
                        : dueSoon
                          ? "text-yellow-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {formattedDate}
                    {overdue && " · Overdue"}
                    {dueSoon && !overdue && " · Due soon"}
                  </p>
                </>
              ) : (
                <p className="text-xs font-mono text-muted-foreground"></p>
              )}
            </div>
          </div>
        );
      })}
      <div className="px-4 py-3 flex items-center justify-between bg-muted/20">
        <p className="text-xs font-mono text-muted-foreground">
          Showing {tasks.length} most recent{" "}
          {tasks.length === 1 ? "task" : "tasks"}
        </p>
        <Link
          href="/tasks"
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          View all tasks
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
