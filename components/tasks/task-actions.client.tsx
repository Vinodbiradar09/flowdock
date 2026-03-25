"use client";

import type { Task } from "@/lib/types/task.types";
import { Button } from "@/components/ui/button";
import { TaskForm } from "./task-form.client";
import { taskApi } from "@/lib/api/task.api";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  DotsThree,
  Trash,
  CheckSquare,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { toast } from "sonner";

type TaskActionsProps = {
  task: Task;
};

export function TaskActions({ task }: TaskActionsProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await taskApi.delete(task.id);
      if (!res.success) {
        toast.error(res.message ?? "Failed to delete task");
        return;
      }
      toast.success("Task deleted successfully");
      setDeleteOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      setIsTogglingStatus(true);
      const newStatus = task.status === "DONE" ? "TODO" : "DONE";
      const res = await taskApi.update(task.id, { status: newStatus });
      if (!res.success) {
        toast.error(res.message ?? "Failed to update task");
        return;
      }
      toast.success(
        newStatus === "DONE"
          ? "Task marked as complete"
          : "Task reopened successfully",
      );
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isTogglingStatus}
            className="rounded-none h-7 w-7 p-0 hover:bg-muted"
          >
            {isTogglingStatus ? (
              <span className="w-3.5 h-3.5 border border-current border-t-transparent animate-spin rounded-full" />
            ) : (
              <DotsThree size={16} className="text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 rounded-none border-border font-mono"
          align="end"
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Task
            </p>
            <p className="text-xs font-mono text-foreground truncate mt-0.5">
              {task.title}
            </p>
          </div>

          <DropdownMenuItem
            className="rounded-none px-3 py-2.5 gap-3 cursor-pointer font-mono text-xs"
            onSelect={(e) => e.preventDefault()}
            onClick={handleToggleComplete}
          >
            {task.status === "DONE" ? (
              <>
                <ArrowCounterClockwise
                  size={13}
                  className="text-muted-foreground"
                />
                <div className="flex flex-col">
                  <span className="text-foreground">Reopen task</span>
                  <span className="text-muted-foreground">
                    Move back to Todo
                  </span>
                </div>
              </>
            ) : (
              <>
                <CheckSquare size={13} className="text-green-400" />
                <div className="flex flex-col">
                  <span className="text-foreground">Mark as complete</span>
                  <span className="text-muted-foreground">
                    Move to Done status
                  </span>
                </div>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem
            className="rounded-none px-3 py-2.5 gap-3 cursor-pointer font-mono text-xs"
            onSelect={(e) => e.preventDefault()}
          >
            <TaskForm mode="edit" task={task} />
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border" />

          <DropdownMenuItem
            className="rounded-none px-3 py-2.5 gap-3 cursor-pointer font-mono text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
            onSelect={(e) => e.preventDefault()}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash size={13} />
            <div className="flex flex-col">
              <span>Delete task</span>
              <span className="text-muted-foreground">
                Permanently remove this task
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-none border-border font-mono p-0">
          <AlertDialogHeader className="border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <Trash size={14} className="text-destructive" />
              <AlertDialogTitle className="text-sm font-mono font-medium uppercase tracking-widest">
                Delete Task
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs font-mono text-muted-foreground mt-1">
              This action cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="px-6 py-5 flex flex-col gap-3">
            <div className="border border-border p-3 flex flex-col gap-1">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Task to be deleted
              </p>
              <p className="text-sm font-mono text-foreground">{task.title}</p>
              {task.description && (
                <p className="text-xs font-mono text-muted-foreground truncate">
                  {task.description}
                </p>
              )}
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Deleting this task will permanently remove it from your Flowdock
              workspace. This action cannot be reversed.
            </p>
          </div>

          <AlertDialogFooter className="border-t border-border px-6 py-4 flex items-center justify-end gap-2">
            <AlertDialogCancel
              className="rounded-none h-9 font-mono text-xs border-border"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-none h-9 font-mono text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border border-current border-t-transparent animate-spin rounded-full" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash size={13} />
                  Delete Task
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
