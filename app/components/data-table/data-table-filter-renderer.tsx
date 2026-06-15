import type { Column } from "@tanstack/react-table"
import { DateTimeRangeFilter } from "./filters/datetime-range-filter"
import { MultiChoiceFilter } from "./filters/multi-choice-filter"
import { NumberRangeFilter } from "./filters/number-range-filter"
import { TextFilter } from "./filters/text-filter"
import { TimeRangeFilter } from "./filters/time-range-filter"
import { DateRangeFilter } from "./filters/date-range-filter"

type Props<TData, TValue> = {
    column: Column<TData, TValue>
    value: unknown
    onChange: (value: unknown) => void
}

export function DataTableFilterRenderer<TData, TValue>({
    column,
    value,
    onChange,
}: Props<TData, TValue>) {
    const meta = column.columnDef.meta

    switch (
    meta?.filterVariant
    ) {
        case "text":
            return (
                <TextFilter
                    value={(value as string) ?? ""}
                    onChange={onChange}
                />
            )

        case "multi-choice":
            return (
                <MultiChoiceFilter
                    value={
                        (value as string[]) ?? []
                    }
                    onChange={onChange}
                    options={
                        meta.filterOptions ??
                        []
                    }
                />
            )

        case "number-range":
            return (
                <NumberRangeFilter
                    value={
                        (value as { min?: number; max?: number }) ?? {}
                    }
                    onChange={onChange}
                />
            )

        case "datetime-range":
            return (
                <DateTimeRangeFilter
                    value={
                        (value as { min?: string; max?: string }) ?? {}
                    }
                    onChange={onChange}
                />
            )

        case "time-range":
            return (
                <TimeRangeFilter
                    value={
                        (value as { min?: string; max?: string }) ?? {}
                    }
                    onChange={onChange}
                />
            )

        case "date-range":
            return (
                <DateRangeFilter
                    value={
                        (value as { min?: string; max?: string }) ?? {}
                    }
                    onChange={onChange}
                />
            )

        default:
            return null
    }
}