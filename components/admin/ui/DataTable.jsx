"use client";

import React, { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Search, Loader2, Inbox } from "lucide-react";

/**
 * A highly reusable and flexible DataTable component.
 *
 * @param {Object} props
 * @param {Array} props.columns - TanStack Table column definitions
 * @param {Array} props.data - The data to display
 * @param {Boolean} props.isLoading - Loading state
 * @param {String} props.emptyContent - Content to show when no data
 * @param {Object} props.pagination - Pagination config: { page, total, onChange }
 * @param {Object} props.search - Search config: { value, onChange, placeholder }
 * @param {React.ReactNode} props.topContent - Extra content for the top area
 * @param {React.ReactNode} props.bottomContent - Extra content for the bottom area
 */
const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  emptyContent = (
    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 m-4">
      <Inbox className="text-slate-200 dark:text-slate-800" size={64} />
      <p className="text-slate-400 font-medium">No records found.</p>
    </div>
  ),
  pagination,
  search,
  topContent,
  bottomContent,
  classNames = {},
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const renderTopContent = useMemo(() => {
    if (!search && !topContent) return null;

    return (
      <div className="flex flex-col gap-4 p-6 pb-2">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          {search && (
            <Input
              isClearable
              className="w-full sm:max-w-[400px]"
              placeholder={search.placeholder || "Search..."}
              startContent={<Search size={18} className="text-slate-400" />}
              value={search.value}
              onClear={() => search.onChange("")}
              onValueChange={search.onChange}
              variant="bordered"
              radius="lg"
            />
          )}
          {topContent}
        </div>
      </div>
    );
  }, [search, topContent]);

  const renderBottomContent = useMemo(() => {
    if (!pagination && !bottomContent) return null;

    return (
      <div className="py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {pagination && (
          <span className="text-small text-slate-500 font-bold">
            {pagination.label ||
              `Total results: ${pagination.totalItems || data.length}`}
          </span>
        )}
        {pagination && pagination.total > 1 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={pagination.page}
            total={pagination.total}
            onChange={pagination.onChange}
            radius="lg"
          />
        )}
        {bottomContent}
      </div>
    );
  }, [pagination, bottomContent, data.length]);

  return (
    <div className="space-y-4">
      <Table
        aria-label="Data Table"
        bottomContent={renderBottomContent}
        bottomContentPlacement="inside"
        classNames={{
          wrapper:
            "bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-800 shadow-sm p-0 overflow-x-auto",
          th: "bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold text-xs uppercase tracking-wider h-14 px-6",
          td: "py-4 px-6",
          ...classNames,
        }}
        topContent={renderTopContent}
        topContentPlacement="inside"
      >
        <TableHeader>
          {table?.getHeaderGroups()?.[0]?.headers?.map((header) => (
            <TableColumn
              key={header.id}
              id={header.id}
              align={header.column.columnDef.meta?.align || "start"}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? " " : emptyContent}
          items={table.getRowModel().rows}
          loadingContent={
            <Loader2 className="animate-spin text-primary" size={32} />
          }
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
