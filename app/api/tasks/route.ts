import { FlowdockApiResponse, handleApiError } from "@/lib/error/handler";
import { requireSession } from "@/lib/auth/server/require-session";
import { validateRequest } from "@/lib/zod/validate-request";
import { ZodCreateTask } from "@/lib/zod/zod-createTask";
import { ZodTaskQuery } from "@/lib/zod/zod-taskQuery";
import { createTask } from "@/lib/task/task.service";
import { listTasks } from "@/lib/task/task.query";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();

    const input = validateRequest(ZodCreateTask, body);

    const task = await createTask(session.user.id, input);

    return FlowdockApiResponse(201, "Task created successfully", task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();

    const rawQuery = Object.fromEntries(req.nextUrl.searchParams);
    const query = ZodTaskQuery.parse(rawQuery);

    const result = await listTasks(session.user.id, query);

    return FlowdockApiResponse(200, "Tasks fetched successfully", result);
  } catch (error) {
    return handleApiError(error);
  }
}
