import { FlowdockApiResponse, handleApiError } from "@/lib/error/handler";
import { getTaskAnalytics } from "@/lib/analytics/analytics.service";
import { requireSession } from "@/lib/auth/server/require-session";

export async function GET() {
  try {
    const session = await requireSession();

    const analytics = await getTaskAnalytics(session.user.id);

    return FlowdockApiResponse(
      200,
      "Task analytics fetched successfully",
      analytics,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
