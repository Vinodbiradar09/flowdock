import { z } from "zod";

export const ZodUpdateTask = z
  .object({
    title: z.string().min(1, "title cannot be empty").max(200).optional(),

    description: z.string().max(2000).optional(),

    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

    dueDate: z
      .string()
      .datetime({ message: "dueDate must be a valid ISO datetime" })
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

export type UpdateTaskInput = z.infer<typeof ZodUpdateTask>;
