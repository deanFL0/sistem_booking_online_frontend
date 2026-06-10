import type { Table } from "@tanstack/react-table"
import { Button } from "../ui/button"

type Props<TData> = {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: Props<TData>) {
    return (
        <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} row(s) total.
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={
                    !table.getCanPreviousPage()
                }
            >
                First
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={
                    !table.getCanPreviousPage()
                }
            >
                Previous
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={
                    !table.getCanNextPage()
                }
            >
                Next
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={
                    !table.getCanNextPage()
                }
            >
                Last
            </Button>
        </div>
    )
}
