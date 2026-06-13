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
    actions?: ActionColumnConfig<TData>;
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
    actions,
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

    return (
        <>
            <div className="space-y-4">
                <DataTableFilters
                    table={table}
                    filters={filters}
                    onFiltersChange={
                        onFiltersChange
                    }
                />

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                    >
                                        {headerGroup.headers.map(
                                            (header) => (
                                                <TableHead
                                                    key={header.id}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        )}
                                    </TableRow>
                                ))}
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            columns.length
                                        }
                                    >
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel()
                                .rows.length ? (
                                table
                                    .getRowModel()
                                    .rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={
                                            columns.length
                                        }
                                    >
                                        Hasil tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DataTablePagination
                    table={table}
                />
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
    )
}