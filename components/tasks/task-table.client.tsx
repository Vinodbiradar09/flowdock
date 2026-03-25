"use client";
import type { Task, TaskMeta } from "@/lib/types/task.types";
import { TaskActions } from "./task-actions.client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarBlank,
  CheckSquare,
  Clock,
  Spinner,
} from "@phosphor-icons/react";

type TaskTableProps = {
  tasks: Task[];
  meta: TaskMeta;
};

const statusConfig = {
  TODO: {
    label: "Todo",
    icon: Clock,
    className:
      "rounded-none font-mono text-xs border-border text-muted-foreground bg-transparent hover:bg-transparent",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Spinner,
    className:
      "rounded-none font-mono text-xs border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/10",
  },
  DONE: {
    label: "Done",
    icon: CheckSquare,
    className:
      "rounded-none font-mono text-xs border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/10",
  },
};

const priorityConfig = {
  LOW: {
    label: "Low",
    className:
      "rounded-none font-mono text-xs border-border text-muted-foreground bg-transparent hover:bg-transparent",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "rounded-none font-mono text-xs border-yellow-500/30 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/10",
  },
  HIGH: {
    label: "High",
    className:
      "rounded-none font-mono text-xs border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/10",
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

function isOverdue(date: string | null, status: Task["status"]): boolean {
  if (!date || status === "DONE") return false;
  return new Date(date) < new Date();
}

function isDueSoon(date: string | null, status: Task["status"]): boolean {
  if (!date || status === "DONE") return false;
  const diff = new Date(date).getTime() - new Date().getTime();
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 2;
}

export function TaskTable({ tasks, meta }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3">
        <CheckSquare size={24} className="text-muted-foreground" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-mono text-foreground">No tasks found</p>
          <p className="text-xs font-mono text-muted-foreground">
            Try adjusting your filters or create a new task to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-8 font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 px-4">
                #
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3">
                Title
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 w-36">
                Status
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 w-28">
                Priority
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 w-36">
                Due Date
              </TableHead>
              <TableHead className="font-mono text-xs uppercase tracking-widest text-muted-foreground py-3 w-20 text-right pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, index) => {
              const status = statusConfig[task.status];
              const priority = priorityConfig[task.priority];
              const StatusIcon = status.icon;
              const formattedDate = formatDate(task.dueDate);
              const overdue = isOverdue(task.dueDate, task.status);
              const dueSoon = isDueSoon(task.dueDate, task.status);
              const rowNumber = (meta.page - 1) * meta.limit + index + 1;

              return (
                <TableRow
                  key={task.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-3 px-4 font-mono text-xs text-muted-foreground">
                    {String(rowNumber).padStart(2, "0")}
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-mono truncate max-w-xs",
                          task.status === "DONE"
                            ? "line-through text-muted-foreground"
                            : "text-foreground",
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge className={status.className}>
                      <StatusIcon size={11} className="mr-1" />
                      {status.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge className={priority.className}>
                      {priority.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    {formattedDate ? (
                      <div className="flex items-center gap-1.5">
                        <CalendarBlank
                          size={12}
                          className={cn(
                            overdue
                              ? "text-red-400"
                              : dueSoon
                                ? "text-yellow-400"
                                : "text-muted-foreground",
                          )}
                        />
                        <div className="flex flex-col">
                          <p
                            className={cn(
                              "text-xs font-mono",
                              overdue
                                ? "text-red-400"
                                : dueSoon
                                  ? "text-yellow-400"
                                  : "text-muted-foreground",
                            )}
                          >
                            {formattedDate}
                          </p>
                          {overdue && (
                            <p className="text-xs font-mono text-red-400">
                              Overdue
                            </p>
                          )}
                          {dueSoon && !overdue && (
                            <p className="text-xs font-mono text-yellow-400">
                              Due soon
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-mono text-muted-foreground">
                        —
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <TaskActions task={task} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-mono text-muted-foreground">
          Showing{" "}
          <span className="text-foreground">
            {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)}
          </span>{" "}
          of <span className="text-foreground">{meta.total}</span>{" "}
          {meta.total === 1 ? "task" : "tasks"}
        </p>
        <p className="text-xs font-mono text-muted-foreground">
          Page <span className="text-foreground">{meta.page}</span> of{" "}
          <span className="text-foreground">{meta.totalPages}</span>
        </p>
      </div>
    </div>
  );
}
