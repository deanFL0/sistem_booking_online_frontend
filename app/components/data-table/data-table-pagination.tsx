import type { Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react"

type Props<TData> = {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: Props<TData>) {
    return (
        <div className="flex items-center justify-end space-x-2 p-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} row(s) total.
            </div>

            <Button
                variant="outline"
                size="lg"
                onClick={() => table.setPageIndex(0)}
                disabled={
                    !table.getCanPreviousPage()
                }
            >
                <div className="flex items-center gap-1">
                    <ChevronFirst /> First
                </div>
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={() => table.previousPage()}
                disabled={
                    !table.getCanPreviousPage()
                }
            >
                <ChevronLeft />Previous
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={() => table.nextPage()}
                disabled={
                    !table.getCanNextPage()
                }
            >
                Next <ChevronRight />
            </Button>

            <Button
                variant="outline"
                size="lg"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={
                    !table.getCanNextPage()
                }
            >
                Last <ChevronLast />
            </Button>
        </div>
    )
}
