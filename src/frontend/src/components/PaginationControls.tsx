import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasArticles: boolean;
}

export default function PaginationControls({ currentPage, onPageChange, hasArticles }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        variant="outline"
        size="sm"
        className="gap-2 font-bold"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm font-semibold text-muted-foreground">Page {currentPage + 1}</span>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasArticles}
        variant="outline"
        size="sm"
        className="gap-2 font-bold"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
