import { useState } from "react"
import type { Table } from "@tanstack/react-table"
import { DataTableFilterRenderer } from "./data-table-filter-renderer"
import { Button } from "../ui/button"
import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { Card, CardContent } from "../ui/card"

type Props<TData> = {
    table: Table<TData>
    filters: Record<string, unknown>
    onFiltersChange: (value: Record<string, unknown>) => void
}

export function DataTableFilters<TData>({
    table,
    filters,
    onFiltersChange,
}: Props<TData>) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Helper to determine if a filter value is actually "active"
    const activeFilterCount = Object.entries(filters).filter(([_, value]) => {
        if (value === undefined || value === null || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object") {
            const vals = Object.values(value as Record<string, unknown>);
            return vals.some(v => v !== undefined && v !== null && v !== "");
        }
        return true;
    }).length;

    const hasActiveFilters = activeFilterCount > 0;

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <SlidersHorizontal className="size-4 opacity-70" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => onFiltersChange({})}
                    >
                        <RotateCcw className="size-4 opacity-70" />
                        <span>Atur Ulang</span>
                    </Button>
                )}
            </div>

            {isExpanded && (
                <Card>
                    <CardContent className="pt-6">
                        <div
                            className="
                                    grid
                                    gap-4
                                    grid-cols-[repeat(auto-fit,minmax(220px,1fr))]
                                "
                        >
                            {table
                                .getAllColumns()
                                .map((column) => {
                                    const meta =
                                        column.columnDef.meta

                                    if (
                                        !meta?.filterVariant
                                    ) {
                                        return null
                                    }

                                    const key =
                                        column.id

                                    const label =
                                        meta.filterLabel ||
                                        key

                                    return (
                                        <div
                                            key={key}
                                            className="
                                                    flex
                                                    min-w-0
                                                    flex-col
                                                    gap-1.5
                                                "
                                        >
                                            <label
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wider
                                                    text-muted-foreground
                                                "
                                            >
                                                {label}
                                            </label>

                                            <div className="min-w-0">
                                                <DataTableFilterRenderer
                                                    column={column}
                                                    value={
                                                        filters[key]
                                                    }
                                                    onChange={(
                                                        value
                                                    ) =>
                                                        onFiltersChange(
                                                            {
                                                                ...filters,
                                                                [key]:
                                                                    value,
                                                            }
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}