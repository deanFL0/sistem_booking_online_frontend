import { useState, useEffect } from "react";
import type {
    FieldValues,
    Path,
    UseFormReturn,
} from "react-hook-form";
import { format, parse } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { ChevronDownIcon } from "lucide-react";

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { Calendar } from "../ui/calendar";

type FormDateTimePickerProps<
    T extends FieldValues
> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    disablePastDates?: boolean;
    timezone?: string; // Add timezone prop
};

// Default timezone (Asia/Jakarta UTC+7)
const DEFAULT_TIMEZONE = "Asia/Jakarta";

// Helper to convert Date to local time string for display
const toLocalTimeString = (date: Date, timezone: string): string => {
    const zonedDate = toZonedTime(date, timezone);
    return format(zonedDate, "HH:mm");
};

// Helper to convert local date and time to UTC for storage
const toUTCString = (date: Date, timeString: string, timezone: string): string => {
    const [hours, minutes] = timeString.split(":");
    const localDate = new Date(date);
    localDate.setHours(Number(hours), Number(minutes), 0, 0);

    // Convert local time to UTC
    const utcDate = fromZonedTime(localDate, timezone);
    return format(utcDate, "yyyy-MM-dd HH:mm:ss");
};

// Helper to parse stored UTC value to local Date for display
const parseStoredValue = (value: string | undefined, timezone: string): Date | undefined => {
    if (!value) return undefined;

    let utcDate: Date;

    // Check if it's ISO format
    if (value.includes('T')) {
        utcDate = new Date(value);
    } else {
        // PostgreSQL format - treat as UTC
        utcDate = parse(value, "yyyy-MM-dd HH:mm:ss", new Date());
    }

    if (isNaN(utcDate.getTime())) return undefined;

    // Convert UTC to local timezone for display
    return toZonedTime(utcDate, timezone);
};

// Helper to get current local date in the specified timezone
const getCurrentLocalDate = (timezone: string): Date => {
    const now = new Date();
    return fromZonedTime(now, timezone);
};

export function FormDateTimePicker<
    T extends FieldValues
>({
    form,
    name,
    label,
    disablePastDates = false,
    timezone = DEFAULT_TIMEZONE,
}: FormDateTimePickerProps<T>) {
    const [open, setOpen] = useState(false);

    const value = form.watch(name) as string | undefined;

    // Parse stored UTC value to local date for display
    const localDate = parseStoredValue(value, timezone);

    const updateDate = (
        datePart: Date | undefined,
        timePart?: string
    ) => {
        if (!datePart) {
            form.setValue(name, "" as any);
            return;
        }

        let finalTimePart = timePart;

        // If no time provided, try to preserve existing time or default to 00:00
        if (!finalTimePart) {
            if (localDate) {
                finalTimePart = format(localDate, "HH:mm");
            } else {
                finalTimePart = "00:00";
            }
        }

        // Convert local date+time to UTC for storage
        const utcString = toUTCString(datePart, finalTimePart, timezone);

        form.setValue(name, utcString as any, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const getCurrentTimeString = () => {
        if (localDate && !isNaN(localDate.getTime())) {
            return format(localDate, "HH:mm");
        }
        return "00:00";
    };

    // Disable past dates based on local timezone
    const isPastDate = (date: Date) => {
        if (!disablePastDates) return false;

        const today = getCurrentLocalDate(timezone);
        today.setHours(0, 0, 0, 0);

        const compareDate = toZonedTime(date, timezone);
        compareDate.setHours(0, 0, 0, 0);

        return compareDate < today;
    };

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            <FieldGroup className="flex-row">
                <Field className="flex-1">
                    <Popover
                        open={open}
                        onOpenChange={setOpen}
                    >
                        <PopoverTrigger
                            render={
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                >
                                    {localDate && !isNaN(localDate.getTime())
                                        ? format(localDate, "PPP")
                                        : "Pilih tanggal"}

                                    <ChevronDownIcon />
                                </Button>
                            }
                        />

                        <PopoverContent
                            className="w-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={localDate && !isNaN(localDate.getTime()) ? localDate : undefined}
                                defaultMonth={localDate && !isNaN(localDate.getTime()) ? localDate : getCurrentLocalDate(timezone)}
                                captionLayout="dropdown"
                                disabled={isPastDate}
                                onSelect={(date) => {
                                    if (date) {
                                        updateDate(date);
                                    }
                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </Field>

                <Field className="w-32">
                    <Input
                        type="time"
                        value={getCurrentTimeString()}
                        onChange={(e) => {
                            const baseDate = localDate && !isNaN(localDate.getTime())
                                ? localDate
                                : getCurrentLocalDate(timezone);
                            updateDate(baseDate, e.target.value);
                        }}
                    />
                </Field>
            </FieldGroup>

            <FieldError
                errors={
                    [
                        form.formState.errors[name] as {
                            message?: string;
                        },
                    ]
                }
            />
        </Field>
    );
}