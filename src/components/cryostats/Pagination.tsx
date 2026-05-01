import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  total: number;
  pageSize: number;
}

export function Pagination({ page, totalPages, onChange, total, pageSize }: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="px-4 py-3 text-xs text-muted-foreground">
        Showing {total} {total === 1 ? "result" : "results"}
      </div>
    );
  }
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border">
      <div className="text-xs text-muted-foreground">
        <span className="font-mono-num">{start}–{end}</span> of{" "}
        <span className="font-mono-num">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="h-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium font-mono-num min-w-[3rem] text-center">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
