import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="sticky bottom-5 z-50 mt-16 mb-3 flex justify-center pointer-events-none">
      <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl p-1.5 rounded-full border border-border/50 shadow-2xl shadow-primary/10 pointer-events-auto scale-90 sm:scale-100 transition-all hover:scale-105 hover:bg-background/80 hover:border-primary/30">
        <Button
          variant="ghost"
          size="sm"
          asChild
          disabled={currentPage <= 1}
          className={`rounded-full w-10 h-10 p-0 ${
            currentPage <= 1
              ? "pointer-events-none opacity-20"
              : "hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <Link href={`${basePath}?page=${currentPage - 1}`}>
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Link>
        </Button>

        <div className="flex items-center gap-1 px-2 border-x border-border/50">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "ghost"}
              size="sm"
              asChild
              className={`w-9 h-9 rounded-full transition-all ${
                currentPage === p
                  ? "shadow-lg shadow-primary/40 bg-primary text-primary-foreground"
                  : "hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Link
                href={`${basePath}?page=${p}`}
                className="text-xs font-bold local-jetbrains-mono"
              >
                {p}
              </Link>
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          asChild
          disabled={currentPage >= totalPages}
          className={`rounded-full w-10 h-10 p-0 ${
            currentPage >= totalPages
              ? "pointer-events-none opacity-20"
              : "hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <Link href={`${basePath}?page=${currentPage + 1}`}>
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
