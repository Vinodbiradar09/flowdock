import "server-only";
import { TaskAnalytics } from "../utils";
import { db } from "@/lib/db/prisma";

export async function getTaskAnalytics(userId: string): Promise<TaskAnalytics> {
  const [total, completed, pending, inProgress] = await Promise.all([
    db.task.count({
      where: { userId },
    }),
    db.task.count({
      where: { userId, status: "DONE" },
    }),
    db.task.count({
      where: { userId, status: "TODO" },
    }),
    db.task.count({
      where: { userId, status: "IN_PROGRESS" },
    }),
  ]);

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    inProgress,
    completionRate,
  };
}
