import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"
import type { Column } from "@tanstack/react-table"

type Props<TData, TValue> = {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
}: Props<TData, TValue>) {
    const sortable =
        column.columnDef.meta?.sortable

    if (!sortable) {
        return <div>{title}</div>
    }

    return (
        <Button
            variant="ghost"
            className="-ml-3 h-8"

            onClick={() =>
                column.toggleSorting()
            }
        >
            {title}

            {column.getIsSorted() ===
                "asc" ? (
                <ArrowUp />
            ) : column.getIsSorted() ===
                "desc" ? (
                <ArrowDown />
            ) : (
                <ArrowUpDown />
            )}
        </Button>
    )
}