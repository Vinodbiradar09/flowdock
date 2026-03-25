"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react";

type TaskPaginationProps = {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
};

export function TaskPagination({
  currentPage,
  totalPages,
  total,
  limit,
}: TaskPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigateTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | "ellipsis")[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "ellipsis");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1)
      rangeWithDots.push("ellipsis", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  const pages = getPageNumbers();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <p className="text-xs font-mono text-muted-foreground">
          Showing{" "}
          <span className="text-foreground">
            {startItem}–{endItem}
          </span>{" "}
          of <span className="text-foreground">{total}</span>{" "}
          {total === 1 ? "task" : "tasks"}
        </p>
        {isPending && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 border border-muted-foreground border-t-transparent animate-spin rounded-full" />
            <p className="text-xs font-mono text-muted-foreground">
              Loading...
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo(1)}
          disabled={currentPage === 1 || isPending}
          className="rounded-none h-8 w-8 p-0 hover:bg-muted disabled:opacity-30"
        >
          <CaretDoubleLeft size={13} className="text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="rounded-none h-8 w-8 p-0 hover:bg-muted disabled:opacity-30"
        >
          <CaretLeft size={13} className="text-muted-foreground" />
        </Button>
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="h-8 w-8 flex items-center justify-center"
                >
                  <p className="text-xs font-mono text-muted-foreground">...</p>
                </div>
              );
            }

            const isActive = page === currentPage;

            return (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                onClick={() => navigateTo(page)}
                disabled={isPending}
                className={cn(
                  "rounded-none h-8 w-8 p-0 font-mono text-xs",
                  isActive
                    ? "bg-foreground text-background hover:bg-foreground hover:text-background"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {page}
              </Button>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo(currentPage + 1)}
          disabled={currentPage === totalPages || isPending}
          className="rounded-none h-8 w-8 p-0 hover:bg-muted disabled:opacity-30"
        >
          <CaretRight size={13} className="text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateTo(totalPages)}
          disabled={currentPage === totalPages || isPending}
          className="rounded-none h-8 w-8 p-0 hover:bg-muted disabled:opacity-30"
        >
          <CaretDoubleRight size={13} className="text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
