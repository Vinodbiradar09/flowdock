import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RouteParams {
  params: Promise<{ taskId: string }>;
}

export type TaskAnalytics = {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  completionRate: number;
};
