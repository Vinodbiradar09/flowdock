"use client";
import { Plus, PencilSimple, CalendarBlank } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/lib/types/task.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { taskApi } from "@/lib/api/task.api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";

const TaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .max(2000, "Description must be under 2000 characters")
    .optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof TaskFormSchema>;

type TaskFormProps =
  | { mode: "create"; task?: never }
  | { mode: "edit"; task: Task };

function formatDateForInput(date: string | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
}

function formatDateForApi(date: string): string {
  if (!date) return "";
  return new Date(date).toISOString();
}

export function TaskForm({ mode, task }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues:
      mode === "edit" && task
        ? {
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
            dueDate: formatDateForInput(task.dueDate),
          }
        : {
            title: "",
            description: "",
            status: "TODO",
            priority: "MEDIUM",
            dueDate: "",
          },
  });

  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsLoading(true);

      const payload = {
        title: values.title,
        description: values.description || undefined,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? formatDateForApi(values.dueDate) : undefined,
      };

      const res =
        mode === "edit"
          ? await taskApi.update(task.id, payload)
          : await taskApi.create(payload);

      if (!res.success) {
        toast.error(res.message ?? "Something went wrong");
        return;
      }

      toast.success(
        mode === "edit"
          ? "Task updated successfully"
          : "Task created successfully",
      );

      setOpen(false);
      form.reset();
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) form.reset();
    setOpen(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="rounded-none h-9 font-mono text-xs gap-2">
            <Plus size={14} weight="bold" />
            New Task
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none h-7 w-7 p-0 hover:bg-muted"
          >
            <PencilSimple size={13} className="text-muted-foreground" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-none border-border font-mono sm:max-w-lg p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            {mode === "create" ? (
              <Plus size={14} className="text-muted-foreground" />
            ) : (
              <PencilSimple size={14} className="text-muted-foreground" />
            )}
            <DialogTitle className="text-sm font-mono font-medium uppercase tracking-widest">
              {mode === "create" ? "New Task" : "Edit Task"}
            </DialogTitle>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {mode === "create"
              ? "Add a new task to your Flowdock workspace"
              : "Update the details of your task"}
          </p>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-0"
        >
          <div className="flex flex-col gap-5 px-6 py-5">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                {...form.register("title")}
                placeholder="e.g. Implement authentication flow"
                className={cn(
                  "rounded-none h-9 font-mono text-sm border-border placeholder:text-muted-foreground",
                  form.formState.errors.title && "border-destructive",
                )}
              />
              {form.formState.errors.title && (
                <p className="text-xs font-mono text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Description
              </Label>
              <Textarea
                {...form.register("description")}
                placeholder="Add more context about this task..."
                rows={3}
                className="rounded-none font-mono text-sm border-border placeholder:text-muted-foreground resize-none"
              />
              {form.formState.errors.description && (
                <p className="text-xs font-mono text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(val) =>
                    form.setValue("status", val as TaskFormValues["status"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="rounded-none h-9 font-mono text-xs border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border font-mono">
                    <SelectItem
                      value="TODO"
                      className="rounded-none font-mono text-xs"
                    >
                      Todo
                    </SelectItem>
                    <SelectItem
                      value="IN_PROGRESS"
                      className="rounded-none font-mono text-xs"
                    >
                      In Progress
                    </SelectItem>
                    <SelectItem
                      value="DONE"
                      className="rounded-none font-mono text-xs"
                    >
                      Done
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Priority
                </Label>
                <Select
                  value={form.watch("priority")}
                  onValueChange={(val) =>
                    form.setValue(
                      "priority",
                      val as TaskFormValues["priority"],
                      { shouldValidate: true },
                    )
                  }
                >
                  <SelectTrigger className="rounded-none h-9 font-mono text-xs border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-border font-mono">
                    <SelectItem
                      value="LOW"
                      className="rounded-none font-mono text-xs"
                    >
                      Low
                    </SelectItem>
                    <SelectItem
                      value="MEDIUM"
                      className="rounded-none font-mono text-xs"
                    >
                      Medium
                    </SelectItem>
                    <SelectItem
                      value="HIGH"
                      className="rounded-none font-mono text-xs"
                    >
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarBlank size={12} />
                  Due Date
                </div>
              </Label>
              <Input
                {...form.register("dueDate")}
                type="datetime-local"
                className="rounded-none h-9 font-mono text-sm border-border"
              />
            </div>
          </div>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-xs font-mono text-muted-foreground">
              {mode === "create"
                ? "Task will be added to your workspace"
                : "Changes will be saved immediately"}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                className="rounded-none h-9 font-mono text-xs border border-border"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-none h-9 font-mono text-xs gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border border-current border-t-transparent animate-spin rounded-full" />
                    {mode === "create" ? "Creating..." : "Saving..."}
                  </>
                ) : mode === "create" ? (
                  <>
                    <Plus size={13} weight="bold" />
                    Create Task
                  </>
                ) : (
                  <>
                    <PencilSimple size={13} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
