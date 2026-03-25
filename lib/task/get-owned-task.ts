import "server-only";
import { db } from "@/lib/db/prisma";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/lib/error/http-errors";

export async function getOwnedTask(taskId: string, userId: string) {
  console.log("ss", taskId, userId);
  if (!taskId || !userId) {
    throw new ValidationError("Missing taskId or userId");
  }

  const task = await db.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new NotFoundError("Task not found");
  }

  if (task.userId !== userId) {
    throw new ForbiddenError("You do not have permission to access this task");
  }

  return task;
}
