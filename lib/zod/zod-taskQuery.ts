import { z } from "zod";

export const ZodTaskQuery = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "page must be a number")
    .transform(Number)
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/, "limit must be a number")
    .transform(Number)
    .optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  search: z.string().min(1).max(200).optional(),

  sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type TaskQueryInput = z.infer<typeof ZodTaskQuery>;
