import { FlowdockApiResponse, handleApiError } from "@/lib/error/handler";
import { requireSession } from "@/lib/auth/server/require-session";
import { validateRequest } from "@/lib/zod/validate-request";
import { ZodUpdateTask } from "@/lib/zod/zod-updateTask";
import { updateTask } from "@/lib/task/task.service";
import { deleteTask } from "@/lib/task/task.service";
import { RouteParams } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    const body = await req.json();

    const input = validateRequest(ZodUpdateTask, body);
    const { taskId } = await params;
    const task = await updateTask(taskId, session.user.id, input);

    return FlowdockApiResponse(200, "Task updated successfully", task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    const session = await requireSession();
    const { taskId } = await params;
    await deleteTask(taskId, session.user.id);

    return FlowdockApiResponse(200, "Task deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
