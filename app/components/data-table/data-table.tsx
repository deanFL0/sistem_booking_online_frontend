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
    columns: ColumnDef<TData>[]

    data: TData[]

    pageCount: number

    pagination: PaginationState
    onPaginationChange: OnChangeFn<PaginationState>

    sorting: SortingState
    onSortingChange: OnChangeFn<SortingState>

    filters: Record<string, unknown>
    onFiltersChange: (
        value: Record<string, unknown>
    ) => void

    isLoading?: boolean
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

    isLoading,
}: Props<TData>) {
    const table = useReactTable({
        data,
        columns,

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

        getCoreRowModel:
            getCoreRowModel(),
    })

    return (
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
    )
}