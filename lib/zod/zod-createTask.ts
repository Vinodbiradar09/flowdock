import { z } from "zod";

export const ZodCreateTask = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .max(200, "title must be under 200 characters"),

  description: z
    .string()
    .max(2000, "description must be under 2000 characters")
    .optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO datetime" })
    .optional(),
});

export type CreateTaskInput = z.infer<typeof ZodCreateTask>;
