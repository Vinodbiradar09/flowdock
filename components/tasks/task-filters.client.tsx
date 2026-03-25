"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MagnifyingGlass, FunnelSimple, X } from "@phosphor-icons/react";
import type { TaskPriority, TaskStatus } from "@/lib/types/task.types";
import { useCallback, useTransition, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskFiltersProps = {
  currentStatus?: TaskStatus;
  currentPriority?: TaskPriority;
  currentSearch?: string;
  currentSortBy?: string;
  currentSortOrder?: string;
};

const STATUS_OPTIONS: { label: string; value: TaskStatus | "ALL" }[] = [
  { label: "All Statuses", value: "ALL" },
  { label: "Todo", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

const PRIORITY_OPTIONS: { label: string; value: TaskPriority | "ALL" }[] = [
  { label: "All Priorities", value: "ALL" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Created At", value: "createdAt" },
  { label: "Due Date", value: "dueDate" },
  { label: "Priority", value: "priority" },
];

export function TaskFilters({
  currentStatus,
  currentPriority,
  currentSearch,
  currentSortBy = "createdAt",
  currentSortOrder = "desc",
}: TaskFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.value = currentSearch ?? "";
    }
  }, [currentSearch]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "ALL") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "1");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParams({ search: value || undefined });
      }, 400);
    },
    [updateParams],
  );

  const handleClearAll = useCallback(() => {
    if (searchRef.current) searchRef.current.value = "";
    startTransition(() => {
      router.push(pathname);
    });
  }, [pathname, router]);

  const hasActiveFilters =
    !!currentStatus || !!currentPriority || !!currentSearch;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlass
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            ref={searchRef}
            defaultValue={currentSearch ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tasks by title..."
            className="rounded-none pl-9 h-9 font-mono text-xs border-border placeholder:text-muted-foreground"
          />
        </div>

        <Select
          value={currentStatus ?? "ALL"}
          onValueChange={(value) =>
            updateParams({ status: value === "ALL" ? undefined : value })
          }
        >
          <SelectTrigger className="rounded-none h-9 w-40 font-mono text-xs border-border">
            <div className="flex items-center gap-2">
              <FunnelSimple size={13} className="text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-none border-border font-mono">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-none font-mono text-xs"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentPriority ?? "ALL"}
          onValueChange={(value) =>
            updateParams({ priority: value === "ALL" ? undefined : value })
          }
        >
          <SelectTrigger className="rounded-none h-9 w-40 font-mono text-xs border-border">
            <div className="flex items-center gap-2">
              <FunnelSimple size={13} className="text-muted-foreground" />
              <SelectValue placeholder="Priority" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-none border-border font-mono">
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-none font-mono text-xs"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentSortBy}
          onValueChange={(value) => updateParams({ sortBy: value })}
        >
          <SelectTrigger className="rounded-none h-9 w-40 font-mono text-xs border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border font-mono">
            {SORT_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-none font-mono text-xs"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentSortOrder}
          onValueChange={(value) => updateParams({ sortOrder: value })}
        >
          <SelectTrigger className="rounded-none h-9 w-28 font-mono text-xs border-border">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent className="rounded-none border-border font-mono">
            <SelectItem value="desc" className="rounded-none font-mono text-xs">
              Newest
            </SelectItem>
            <SelectItem value="asc" className="rounded-none font-mono text-xs">
              Oldest
            </SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearAll}
            className="rounded-none h-9 px-3 font-mono text-xs border border-border text-muted-foreground hover:text-foreground"
          >
            <X size={13} className="mr-1.5" />
            Clear filters
          </Button>
        )}
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Active:
          </p>
          {currentStatus && (
            <div className="flex items-center gap-1.5 border border-border px-2 py-0.5">
              <div className="w-1.5 h-1.5 bg-blue-500" />
              <p className="text-xs font-mono text-foreground">
                {STATUS_OPTIONS.find((o) => o.value === currentStatus)?.label}
              </p>
            </div>
          )}
          {currentPriority && (
            <div className="flex items-center gap-1.5 border border-border px-2 py-0.5">
              <div className="w-1.5 h-1.5 bg-yellow-500" />
              <p className="text-xs font-mono text-foreground">
                {
                  PRIORITY_OPTIONS.find((o) => o.value === currentPriority)
                    ?.label
                }
              </p>
            </div>
          )}
          {currentSearch && (
            <div className="flex items-center gap-1.5 border border-border px-2 py-0.5">
              <div className="w-1.5 h-1.5 bg-foreground" />
              <p className="text-xs font-mono text-foreground">
                &quot;{currentSearch}&quot;
              </p>
            </div>
          )}
          {isPending && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 border border-muted-foreground border-t-transparent animate-spin rounded-full" />
              <p className="text-xs font-mono text-muted-foreground">
                Updating...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
