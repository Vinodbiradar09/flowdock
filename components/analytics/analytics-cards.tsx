import type { TaskAnalytics } from "@/lib/types/task.types";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckSquare,
  Clock,
  Spinner,
  ListChecks,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";

type AnalyticsCardsProps = {
  analytics: TaskAnalytics | null;
};

type StatCard = {
  label: string;
  sublabel: string;
  value: number | string;
  icon: React.ElementType;
  indicator: string;
  indicatorColor: string;
};

function buildCards(analytics: TaskAnalytics | null): StatCard[] {
  return [
    {
      label: "Total Tasks",
      sublabel: "All tasks in your workspace",
      value: analytics?.total ?? 0,
      icon: ListChecks,
      indicator: "Workspace total",
      indicatorColor: "bg-foreground",
    },
    {
      label: "Completed",
      sublabel: "Tasks marked as done",
      value: analytics?.completed ?? 0,
      icon: CheckSquare,
      indicator: "Done",
      indicatorColor: "bg-green-500",
    },
    {
      label: "In Progress",
      sublabel: "Tasks currently being worked on",
      value: analytics?.inProgress ?? 0,
      icon: Spinner,
      indicator: "Active",
      indicatorColor: "bg-blue-500",
    },
    {
      label: "Pending",
      sublabel: "Tasks not yet started",
      value: analytics?.pending ?? 0,
      icon: Clock,
      indicator: "Todo",
      indicatorColor: "bg-yellow-500",
    },
    {
      label: "Completion Rate",
      sublabel: "Percentage of tasks completed",
      value: `${analytics?.completionRate ?? 0}%`,
      icon: ChartLineUp,
      indicator: "Overall progress",
      indicatorColor:
        (analytics?.completionRate ?? 0) >= 75
          ? "bg-green-500"
          : (analytics?.completionRate ?? 0) >= 40
            ? "bg-yellow-500"
            : "bg-red-500",
    },
  ];
}

export function AnalyticsCards({ analytics }: AnalyticsCardsProps) {
  const cards = buildCards(analytics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="rounded-none border-border bg-card">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <Icon size={14} className="text-muted-foreground mt-0.5" />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-2xl font-mono font-medium text-foreground">
                  {card.value}
                </p>
                <p className="text-xs font-mono font-medium text-foreground">
                  {card.label}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {card.sublabel}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 shrink-0 ${card.indicatorColor}`}
                />
                <p className="text-xs font-mono text-muted-foreground">
                  {card.indicator}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
