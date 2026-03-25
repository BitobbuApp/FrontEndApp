import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Reusable Pagination component for tables and lists.
 * 
 * @param {number} totalItems - Number of items shown in total count label
 * @param {string} itemsLabel - Label for single item (e.g., 'solicitud')
 * @param {string} itemsLabelPlural - Label for multiple items (e.g., 'solicitudes')
 * @param {number} currentPage - 1-based current page
 * @param {number} totalPages - Total pages available
 * @param {function} onPageChange - Callback when page changes
 * @param {string} className - Optional container classes
 */
export default function Pagination({
    totalItems,
    itemsLabel = 'item',
    itemsLabelPlural,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className
}) {
    const pluralLabel = itemsLabelPlural || `${itemsLabel}s`;
    const label = totalItems === 1 ? itemsLabel : pluralLabel;

    return (
        <div className={cn(
            "flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border",
            className
        )}>
            {/* Left: Item count */}
            <span className="text-sm text-slate-500 order-2 sm:order-1">
                {totalItems !== undefined && (
                    <>{totalItems} {label}</>
                )}
            </span>

            {/* Center: Page indicator */}
            <span className="text-sm text-slate-500 order-1 sm:order-2">
                Página {currentPage} de {totalPages}
            </span>

            {/* Right: Navigation buttons */}
            <div className="flex items-center gap-2 order-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="h-8"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="hidden xs:inline">Anterior</span>
                    <span className="xs:hidden">Ant.</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="h-8"
                >
                    <span className="hidden xs:inline">Siguiente</span>
                    <span className="xs:hidden">Sig.</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}
