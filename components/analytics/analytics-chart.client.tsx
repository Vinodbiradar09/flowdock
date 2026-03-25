"use client";
import type { TaskAnalytics } from "@/lib/types/task.types";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type AnalyticsChartProps = {
  analytics: TaskAnalytics | null;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-border bg-card px-3 py-2 font-mono">
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">
        {payload[0].value}{" "}
        <span className="text-muted-foreground font-normal">
          {payload[0].value === 1 ? "task" : "tasks"}
        </span>
      </p>
    </div>
  );
}

export function AnalyticsChart({ analytics }: AnalyticsChartProps) {
  const data = [
    {
      label: "Todo",
      value: analytics?.pending ?? 0,
      color: "oklch(0.708 0 0)",
    },
    {
      label: "In Progress",
      value: analytics?.inProgress ?? 0,
      color: "oklch(0.6 0.15 250)",
    },
    {
      label: "Done",
      value: analytics?.completed ?? 0,
      color: "oklch(0.7 0.15 150)",
    },
  ];

  const total = analytics?.total ?? 0;
  const completionRate = analytics?.completionRate ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="rounded-none border-border bg-card lg:col-span-2">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Task Distribution
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Breakdown of tasks by current status
              </p>
            </div>
            <div className="flex items-center gap-1.5 border border-border px-2 py-1">
              <div className="w-1.5 h-1.5 bg-green-500" />
              <p className="text-xs font-mono text-muted-foreground">
                {completionRate}% complete
              </p>
            </div>
          </div>

          <div className="h-48">
            {total === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 border border-dashed border-border">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  No tasks yet
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  Create your first task to see analytics
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                  barSize={40}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.922 0 0 / 10%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fill: "oklch(0.556 0 0)",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fill: "oklch(0.556 0 0)",
                    }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "oklch(0.922 0 0 / 5%)" }}
                  />
                  <Bar dataKey="value" radius={0}>
                    {data.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex items-center gap-4 pt-1">
            {data.map((entry) => (
              <div key={entry.label} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-xs font-mono text-muted-foreground">
                  {entry.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none border-border bg-card">
        <CardContent className="p-4 flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Completion Rate
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Overall task completion progress
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="relative w-28 h-28 flex items-center justify-center border border-border">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full -rotate-90"
              >
                <rect
                  x="5"
                  y="5"
                  width="90"
                  height="90"
                  fill="none"
                  stroke="oklch(0.922 0 0 / 10%)"
                  strokeWidth="6"
                />
                <rect
                  x="5"
                  y="5"
                  width="90"
                  height="90"
                  fill="none"
                  stroke="oklch(0.922 0 0)"
                  strokeWidth="6"
                  strokeDasharray={`${completionRate * 3.6} 360`}
                  pathLength="360"
                />
              </svg>
              <div className="flex flex-col items-center z-10">
                <p className="text-2xl font-mono font-medium text-foreground">
                  {completionRate}%
                </p>
                <p className="text-xs font-mono text-muted-foreground">done</p>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-mono text-muted-foreground">
                  Completed
                </p>
                <p className="text-xs font-mono text-foreground">
                  {analytics?.completed ?? 0} / {total}
                </p>
              </div>
              <div className="w-full h-1 bg-muted">
                <div
                  className="h-full bg-foreground transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div
              className={`w-1.5 h-1.5 shrink-0 ${
                completionRate >= 75
                  ? "bg-green-500"
                  : completionRate >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
            />
            <p className="text-xs font-mono text-muted-foreground">
              {completionRate >= 75
                ? "Great progress on your tasks"
                : completionRate >= 40
                  ? "Making steady progress"
                  : "Keep going, you can do it"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
