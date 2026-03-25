import "server-only";
import { CreateTaskInput } from "../zod/zod-createTask";
import { UpdateTaskInput } from "../zod/zod-updateTask";
import { getOwnedTask } from "./get-owned-task";
import { db } from "@/lib/db/prisma";

export async function createTask(userId: string, input: CreateTaskInput) {
  return db.task.create({
    data: {
      userId,
      title: input.title,
      description: input.description ?? null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    },
  });
}

export async function updateTask(
  taskId: string,
  userId: string,
  input: UpdateTaskInput,
) {
  await getOwnedTask(taskId, userId);

  return db.task.update({
    where: { id: taskId },
    data: {
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      dueDate:
        input.dueDate === undefined
          ? undefined
          : input.dueDate
            ? new Date(input.dueDate)
            : null,
      completedAt: input.status === "DONE" ? new Date() : undefined,
    },
  });
}

export async function deleteTask(taskId: string, userId: string) {
  await getOwnedTask(taskId, userId);

  await db.task.delete({
    where: { id: taskId },
  });
}
