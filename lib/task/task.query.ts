import "server-only";
import { TaskQueryInput } from "../zod/zod-taskQuery";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db/prisma";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export async function listTasks(userId: string, query: TaskQueryInput) {
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  const where: Prisma.TaskWhereInput = {
    userId,
    status: query.status,
    priority: query.priority,
    title: query.search
      ? {
          contains: query.search,
          mode: Prisma.QueryMode.insensitive,
        }
      : undefined,
  };

  const orderBy = query.sortBy
    ? {
        [query.sortBy]: query.sortOrder ?? "desc",
      }
    : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    db.task.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    db.task.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
