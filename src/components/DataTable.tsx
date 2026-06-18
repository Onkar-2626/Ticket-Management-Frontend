import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import Pagination from './Pagination';
import { SkeletonRow } from './Loader';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchQuery?: string;
  pageSize?: number;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  searchQuery = '',
  pageSize = 5,
  loading = false,
  emptyState,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Handle sorting
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered & Sorted data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery && searchKey) {
      result = result.filter((item) => {
        const value = item[searchKey];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal === undefined || bVal === undefined) return 0;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortConfig]);

  // Pagination bounds
  const totalPages = Math.ceil(processedData.length / pageSize);
  
  // Reset page to 1 on search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-dark-800/80 bg-white/40 dark:bg-dark-950/20 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-dark-800/80 bg-slate-50/50 dark:bg-dark-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-4 text-xs font-bold text-slate-400 dark:text-dark-500 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer select-none hover:text-slate-600 dark:hover:text-dark-350' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-350 dark:text-dark-600">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-800/60 text-sm">
            {loading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <SkeletonRow key={idx} columns={columns.length} />
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || (
                    <p className="text-slate-450 dark:text-dark-500 font-medium">
                      No matching records found.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, itemIdx) => (
                <tr
                  key={item.cust_id || item.bid || itemIdx}
                  className="hover:bg-slate-50/30 dark:hover:bg-dark-850/20 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                      {col.render ? col.render(item, itemIdx) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && processedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DataTable;
