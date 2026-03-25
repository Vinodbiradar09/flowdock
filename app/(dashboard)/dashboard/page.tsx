import { AnalyticsChart } from "@/components/analytics/analytics-chart.client";
import { AnalyticsCards } from "@/components/analytics/analytics-cards";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { serverFetch } from "@/lib/api/server-fetch";
import {
  ChartBar,
  CheckSquare,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import type {
  ApiSuccessResponse,
  TaskAnalytics,
  TaskListResponse,
} from "@/lib/types/task.types";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard — Flowdock",
  description: "Overview of your tasks, analytics and progress insights",
};

export default async function DashboardPage() {
  const [analyticsRes, recentTasksRes] = await Promise.all([
    serverFetch<ApiSuccessResponse<TaskAnalytics>>("/api/tasks/analytics"),
    serverFetch<ApiSuccessResponse<TaskListResponse>>(
      "/api/tasks?limit=5&sortBy=createdAt&sortOrder=desc",
    ),
  ]);

  const analytics = analyticsRes.data;
  const recentTasks = recentTasksRes.data?.items ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <ChartBar
              size={16}
              weight="fill"
              className="text-muted-foreground"
            />
            <h1 className="text-sm font-mono font-medium text-foreground uppercase tracking-widest">
              Dashboard
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            Overview of your task progress and analytics
          </p>
        </div>
        <Link
          href="/tasks"
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5"
        >
          <CheckSquare size={13} />
          View all tasks
          <ArrowRight size={13} />
        </Link>
      </header>
      <main className="flex-1 px-6 py-6 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Analytics Overview
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <AnalyticsCards analytics={analytics} />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Task Progress
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <AnalyticsChart analytics={analytics} />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Recent Tasks
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <RecentTasks tasks={recentTasks} />
        </section>
      </main>
    </div>
  );
}
