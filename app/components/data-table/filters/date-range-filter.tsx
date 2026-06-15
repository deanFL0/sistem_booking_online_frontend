import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { Calendar } from "~/components/ui/calendar"

type Props = {
    value?: {
        min?: string
        max?: string
    }

    onChange: (
        value: {
            min?: string
            max?: string
        }
    ) => void
}

export function DateRangeFilter({
    value,
    onChange,
}: Props) {
    const selected = {
        from: value?.min
            ? new Date(value.min)
            : undefined,
        to: value?.max
            ? new Date(value.max)
            : undefined,
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button
                    variant="outline"
                    className="justify-start px-2.5 font-normal"
                >
                    <CalendarIcon />

                    {value?.min ? (
                        value.max ? (
                            <>
                                {format(new Date(value.min), "LLL dd, yyyy")}
                                {" - "}
                                {format(new Date(value.max), "LLL dd, yyyy")}
                            </>
                        ) : (
                            format(new Date(value.min), "LLL dd, yyyy")
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={selected}
                    onSelect={(range) => {
                        const from = range?.from;
                        const to = range?.to;

                        onChange({
                            min: from
                                ? `${format(from, "yyyy-MM-dd")} 00:00:00`
                                : undefined,

                            max: to
                                ? `${format(to, "yyyy-MM-dd")} 23:59:59`
                                : from
                                    ? `${format(from, "yyyy-MM-dd")} 23:59:59`
                                    : undefined,
                        });
                    }}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    )
}