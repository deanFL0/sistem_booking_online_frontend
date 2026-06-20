import { flexRender, getCoreRowModel, useReactTable, type RowData } from "@tanstack/react-table"
import type {
    ColumnDef,
    PaginationState,
    SortingState,
    OnChangeFn,
} from "@tanstack/react-table"
import { DataTableFilters } from "./data-table-filters"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { createActionsColumn, type ActionColumnConfig } from "./action-column"
import { useState } from "react"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { Skeleton } from "../ui/skeleton"
import { Loader2 } from "lucide-react"
import { cn } from "~/lib/utils"

declare module "@tanstack/react-table" {
    interface ColumnMeta<
        TData extends RowData,
        TValue,
    > {
        filterLabel?: string

        sortable?: boolean

        filterVariant?:
        | "text"
        | "multi-choice"
        | "number-range"
        | "datetime-range"
        | "time-range"
        | "date-range"

        filterOptions?: {
            label: string
            value: string
        }[]
    }
}

type Props<TData> = {
    columns: ColumnDef<TData>[];
    data: TData[];
    pageCount?: number;
    pagination?: PaginationState;
    onPaginationChange?: OnChangeFn<PaginationState>;
    sorting?: SortingState;
    onSortingChange?: OnChangeFn<SortingState>;
    filters?: any;
    onFiltersChange?: any;
    showNumberColumn?: boolean;
    isLoading?: boolean;
    isFetching?: boolean;
    actions?: ActionColumnConfig<TData>;
    getRowClassName?: (row: TData) => string;
};

function createNumberColumn<TData>(): ColumnDef<TData> {
    return {
        id: "rowNumber",
        header: "No.",
        cell: ({ row, table }) => {
            const { pageIndex, pageSize } =
                table.getState().pagination;

            return pageIndex * pageSize + row.index + 1;
        },
    };
}

interface SkeletonRowProps {
    columnCount: number;
    hasNumberColumn: boolean;
    hasActions: boolean;
}

function SkeletonRow({ columnCount, hasNumberColumn, hasActions }: SkeletonRowProps) {
    const totalColumns = columnCount + (hasNumberColumn ? 1 : 0) + (hasActions ? 1 : 0);

    return (
        <TableRow>
            {Array.from({ length: totalColumns }).map((_, index) => (
                <TableCell key={index} className="py-4">
                    <Skeleton className="h-6 w-full" />
                </TableCell>
            ))}
        </TableRow>
    );
}

export function DataTable<TData>({
    columns,
    data,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    filters,
    onFiltersChange,
    showNumberColumn,
    isLoading,
    isFetching,
    actions,
    getRowClassName,
}: Props<TData>) {
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        data: TData | null;
        message: string;
        isDeleting: boolean;
    }>({
        isOpen: false,
        data: null,
        message: "",
        isDeleting: false,
    });

    const openDeleteDialog = (data: TData, message: string) => {
        setDeleteDialog({
            isOpen: true,
            data,
            message,
            isDeleting: false,
        });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({
            isOpen: false,
            data: null,
            message: "",
            isDeleting: false,
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.data || !actions?.onDelete) return;

        setDeleteDialog(prev => ({ ...prev, isDeleting: true }));
        try {
            await actions.onDelete(deleteDialog.data);
            // Optionally refresh data or show success message
        } catch (error) {
            console.error("Delete failed:", error);
            // Handle error - show error message
        } finally {
            setDeleteDialog(prev => ({ ...prev, isDeleting: false }));
        }
    };

    const tableColumns = actions
        ? [...columns, createActionsColumn(actions, {
            isOpen: deleteDialog.isOpen,
            data: deleteDialog.data,
            message: deleteDialog.message,
            openDialog: openDeleteDialog,
            closeDialog: closeDeleteDialog,
        })]
        : columns;

    if (showNumberColumn) {
        tableColumns.unshift(createNumberColumn());
    }

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            pagination,
            sorting,
        },
        pageCount,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onPaginationChange,
        onSortingChange,
        getCoreRowModel: getCoreRowModel(),
    });

    // Show skeleton only on initial load
    const showSkeletonRows = isLoading && data.length === 0;
    // Show overlay when fetching (including filter/sort operations) and we already have data
    const showOverlay = isFetching && data.length > 0;

    return (
        <>
            <div className="space-y-4">
                {/* Make filters clickable but show loading state visually */}
                <div className="relative">
                    {isFetching && data.length > 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    )}
                    {filters && onFiltersChange && (
                        <DataTableFilters
                            table={table}
                            filters={filters}
                            onFiltersChange={onFiltersChange}
                        />
                    )}
                </div>

                <div className="rounded-md border relative">
                    {/* Show loading overlay during fetch operations */}
                    {showOverlay && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-md z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
                                <p className="text-sm text-muted-foreground">Memuat data...</p>
                            </div>
                        </div>
                    )}

                    <div className={showOverlay ? "pointer-events-none opacity-60 transition-opacity" : ""}>
                        <Table>
                            <TableHeader>
                                {table
                                    .getHeaderGroups()
                                    .map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                            </TableHeader>

                            <TableBody>
                                {showSkeletonRows ? (
                                    Array.from({
                                        length: pagination?.pageSize || 10,
                                    }).map((_, index) => (
                                        <SkeletonRow
                                            key={index}
                                            columnCount={columns.length}
                                            hasNumberColumn={showNumberColumn || false}
                                            hasActions={!!actions}
                                        />
                                    ))
                                ) : table.getRowModel().rows.length ? (
                                    table
                                        .getRowModel()
                                        .rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                className={cn(
                                                    getRowClassName?.(row.original)
                                                )}
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length}>
                                            Hasil tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {pagination && (
                        <div className={showOverlay ? "opacity-60 pointer-events-none" : ""}>
                            <DataTablePagination table={table} />
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {actions?.onDelete && (
                <DeleteConfirmationDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={closeDeleteDialog}
                    onConfirm={handleDeleteConfirm}
                    message={deleteDialog.message}
                    isLoading={deleteDialog.isDeleting}
                />
            )}
        </>
    );
}