import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    page: number;           // 0-based
    totalPages: number;
    totalElements: number;
    size: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

function buildPageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i);
    }

    const pages: (number | '...')[] = [];

    if (current <= 3) {
        pages.push(0, 1, 2, 3, 4, '...', total - 1);
    } else if (current >= total - 4) {
        pages.push(0, '...', total - 5, total - 4, total - 3, total - 2, total - 1);
    } else {
        pages.push(0, '...', current - 1, current, current + 1, '...', total - 1);
    }

    return pages;
}

export const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    totalElements,
    size,
    onPageChange,
    loading = false,
}) => {
    if (totalPages <= 1) return null;

    const from = page * size + 1;
    const to = Math.min((page + 1) * size, totalElements);
    const pageNumbers = buildPageNumbers(page, totalPages);

    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    const btnBase =
        'flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-all duration-150 select-none disabled:opacity-40 disabled:cursor-not-allowed';

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1 py-3">
            {/* Results info */}
            <p className="text-sm text-[#546E7A] shrink-0">
                Showing{' '}
                <span className="font-semibold text-[#263238]">{from}</span>
                {' – '}
                <span className="font-semibold text-[#263238]">{to}</span>
                {' of '}
                <span className="font-semibold text-[#263238]">{totalElements}</span>
                {' results'}
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* First */}
                <button
                    className={`${btnBase} text-[#546E7A] hover:bg-[#ECEFF1] hover:text-[#263238]`}
                    onClick={() => onPageChange(0)}
                    disabled={!canPrev || loading}
                    title="First page"
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* Prev */}
                <button
                    className={`${btnBase} text-[#546E7A] hover:bg-[#ECEFF1] hover:text-[#263238]`}
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canPrev || loading}
                    title="Previous page"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-1">
                    {pageNumbers.map((p, idx) =>
                        p === '...' ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="flex items-end justify-center h-9 w-9 text-sm text-[#546E7A] pb-1"
                            >
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                disabled={loading}
                                className={`
                                    ${btnBase}
                                    ${p === page
                                        ? 'bg-[#0D7377] text-white shadow-md shadow-[#0D7377]/30 ring-2 ring-[#0D7377]/20 scale-105'
                                        : 'text-[#546E7A] hover:bg-[#ECEFF1] hover:text-[#263238]'
                                    }
                                `}
                            >
                                {(p as number) + 1}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    className={`${btnBase} text-[#546E7A] hover:bg-[#ECEFF1] hover:text-[#263238]`}
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canNext || loading}
                    title="Next page"
                >
                    <ChevronRight size={16} />
                </button>

                {/* Last */}
                <button
                    className={`${btnBase} text-[#546E7A] hover:bg-[#ECEFF1] hover:text-[#263238]`}
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={!canNext || loading}
                    title="Last page"
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
};
