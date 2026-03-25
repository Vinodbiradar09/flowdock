import { z } from "zod";
import { ValidationError } from "@/lib/error/http-errors";

export function validateRequest<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      })
      .join("; ");

    throw new ValidationError(message);
  }

  return result.data;
}
