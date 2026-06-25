'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-xs">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all disabled:opacity-30"
        title="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="px-3 py-2 text-on-surface font-label-md text-[14px]">
        {page} / {Math.max(1, totalPages)}
      </div>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages || totalPages === 0}
        className="w-10 h-10 border border-outline-variant rounded flex items-center justify-center text-on-surface hover:bg-surface-container-high active:scale-95 transition-all disabled:opacity-30"
        title="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
