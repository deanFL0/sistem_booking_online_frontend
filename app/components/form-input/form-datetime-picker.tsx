import { useState, useEffect, useMemo, useCallback } from "react";
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

// Props interface
type FormDateTimePickerProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    timezone?: string;
    disablePastDates?: boolean;

    // Optional availability props
    availableDates?: string[];
    availableTimes?: string[];
    selectedDate?: string | null;
    onDateSelect?: (date: string) => void;
    isLoading?: boolean;
    isTimesLoading?: boolean;
    availabilityError?: string | null;

    // Additional customization
    placeholder?: string;
    dateFormat?: string;
    timeFormat?: string;
};

const DEFAULT_TIMEZONE = "Asia/Jakarta";

// Helper functions
// To local time string
const toLocalTimeString = (date: Date, timezone: string): string => {
    const zonedDate = toZonedTime(date, timezone);
    return format(zonedDate, "HH:mm");
};

// To UTC string
const toUTCString = (date: Date, timeString: string, timezone: string): string => {
    const [hours, minutes] = timeString.split(":");
    const localDate = new Date(date);
    localDate.setHours(Number(hours), Number(minutes), 0, 0);
    const utcDate = fromZonedTime(localDate, timezone);
    return format(utcDate, "yyyy-MM-dd HH:mm:ss");
};

// Parse stored value to local time
const parseStoredValue = (value: string | undefined, timezone: string): Date | undefined => {
    if (!value) return undefined;

    let utcDate: Date;
    if (value.includes('T')) {
        utcDate = new Date(value);
    } else {
        utcDate = parse(value, "yyyy-MM-dd HH:mm:ss", new Date());
    }

    if (isNaN(utcDate.getTime())) return undefined;
    return toZonedTime(utcDate, timezone);
};

// Get current date in local time
const getCurrentLocalDate = (timezone: string): Date => {
    const now = new Date();
    return fromZonedTime(now, timezone);
};

export function FormDateTimePicker<T extends FieldValues>({
    form,
    name,
    label,
    timezone = DEFAULT_TIMEZONE,
    disablePastDates = false,
    availableDates,
    availableTimes,
    selectedDate,
    onDateSelect,
    isLoading = false,
    isTimesLoading = false,
    availabilityError,
    placeholder = "Pilih tanggal",
    dateFormat = "PPP",
}: FormDateTimePickerProps<T>) {
    const [open, setOpen] = useState(false);
    const value = form.watch(name) as string | undefined;
    const localDate = parseStoredValue(value, timezone);

    // Check if availability mode is enabled
    const isAvailabilityMode = Boolean(
        availableDates !== undefined ||
        availableTimes !== undefined ||
        onDateSelect !== undefined
    );

    // Update date in form
    const updateDate = useCallback((datePart: Date | undefined, timePart?: string) => {
        if (!datePart) {
            form.setValue(name, "" as any);
            return;
        }

        let finalTimePart = timePart;
        if (!finalTimePart) {
            if (localDate) {
                finalTimePart = format(localDate, "HH:mm");
            } else {
                finalTimePart = "00:00";
            }
        }

        const utcString = toUTCString(datePart, finalTimePart, timezone);
        form.setValue(name, utcString as any, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    }, [form, name, localDate, timezone]);

    // Get current time string
    const getCurrentTimeString = useCallback(() => {
        if (localDate && !isNaN(localDate.getTime())) {
            return format(localDate, "HH:mm");
        }
        return "00:00";
    }, [localDate]);

    // Check if date is in available dates
    const isPastDate = useCallback((date: Date) => {
        if (!disablePastDates) return false;
        const today = getCurrentLocalDate(timezone);
        today.setHours(0, 0, 0, 0);
        const compareDate = toZonedTime(date, timezone);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate < today;
    }, [disablePastDates, timezone]);

    // Check if date is in available dates (only if availability mode is enabled)
    const isDateAvailable = useCallback((date: Date): boolean => {
        if (!isAvailabilityMode || !availableDates) return true;
        if (!availableDates.length) return false;
        const dateStr = format(date, 'yyyy-MM-dd');
        return availableDates.includes(dateStr);
    }, [isAvailabilityMode, availableDates]);

    // Check if date should be disabled
    const isDateDisabled = useCallback((date: Date): boolean => {
        if (isPastDate(date)) return true;
        if (isAvailabilityMode) {
            return !isDateAvailable(date);
        }
        return false;
    }, [isPastDate, isAvailabilityMode, isDateAvailable]);

    // Handle date selection
    const handleDateSelect = useCallback((date: Date | undefined) => {
        if (!date) return;

        // If availability mode is enabled, notify parent
        if (isAvailabilityMode && onDateSelect) {
            const dateStr = format(date, 'yyyy-MM-dd');
            onDateSelect(dateStr);
        }

        // If we have available times, select the first one
        if (isAvailabilityMode && availableTimes && availableTimes.length > 0) {
            updateDate(date, availableTimes[0]);
        } else {
            updateDate(date, getCurrentTimeString());
        }
        setOpen(false);
    }, [isAvailabilityMode, onDateSelect, availableTimes, updateDate, getCurrentTimeString]);

    // Handle time selection
    const handleTimeChange = useCallback((time: string) => {
        // Check if time is available (only in availability mode)
        if (isAvailabilityMode && availableTimes && !availableTimes.includes(time)) {
            form.setError(name, {
                type: 'manual',
                message: 'Jam yang dipilih tidak tersedia, silahkan pilih jam lain.',
            });
            return;
        }

        form.clearErrors(name);
        const baseDate = localDate && !isNaN(localDate.getTime())
            ? localDate
            : getCurrentLocalDate(timezone);
        updateDate(baseDate, time);
    }, [isAvailabilityMode, availableTimes, form, name, localDate, timezone, updateDate]);

    // Get display date text
    const getDisplayDate = useCallback((): string => {
        if (localDate && !isNaN(localDate.getTime())) {
            return format(localDate, dateFormat);
        }
        if (isAvailabilityMode && selectedDate) {
            return format(new Date(selectedDate), dateFormat);
        }
        return placeholder;
    }, [localDate, dateFormat, isAvailabilityMode, selectedDate, placeholder]);

    // Get default month for calendar
    const getDefaultMonth = useCallback((): Date => {
        if (localDate && !isNaN(localDate.getTime())) {
            return localDate;
        }
        if (isAvailabilityMode && selectedDate) {
            return new Date(selectedDate);
        }
        return getCurrentLocalDate(timezone);
    }, [localDate, isAvailabilityMode, selectedDate, timezone]);

    // Validate date/time availability (only in availability mode)
    const validationError = useMemo(() => {
        if (!isAvailabilityMode) return null;

        if (selectedDate && availableDates && !availableDates.includes(selectedDate)) {
            return 'Tanggal yang dipilih tidak tersedia, silahkan pilih tanggal lain.';
        }

        if (localDate && !isNaN(localDate.getTime()) && availableTimes) {
            const timeStr = format(localDate, 'HH:mm');
            if (!availableTimes.includes(timeStr)) {
                return 'Jam yang dipilih tidak tersedia, silahkan pilih jam lain.';
            }
        }

        return null;
    }, [isAvailabilityMode, selectedDate, availableDates, localDate, availableTimes]);

    // Set error based on validation
    useEffect(() => {
        if (validationError) {
            form.setError(name, {
                type: 'manual',
                message: validationError,
            });
        } else {
            const currentError = form.formState.errors[name];
            if (currentError?.type === 'manual') {
                form.clearErrors(name);
            }
        }
    }, [validationError, form, name]);

    // Determine if time picker should be disabled
    const isTimePickerDisabled = useMemo(() => {
        if (!isAvailabilityMode) return false;
        if (!selectedDate) return true;
        if (availableTimes && availableTimes.length === 0) return true;
        return false;
    }, [isAvailabilityMode, selectedDate, availableTimes]);

    // Determine if time picker should show loading
    const isTimeLoading = useMemo(() => {
        return isAvailabilityMode && isTimesLoading;
    }, [isAvailabilityMode, isTimesLoading]);

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            {availabilityError && (
                <p className="text-sm text-destructive mb-2">
                    Maaf, terjadi kesalahan saat memuat ketersediaan. {availabilityError}
                </p>
            )}

            <FieldGroup className="flex-row">
                <Field className="flex-1">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                            render={
                                <Button
                                    variant="outline"
                                    className="w-full justify-between font-normal"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Loading dates..." : getDisplayDate()}
                                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                </Button>
                            }
                        />
                        <PopoverContent className="w-auto p-0" align="start">
                            {isLoading ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Loading available dates...
                                </div>
                            ) : isAvailabilityMode && availableDates && availableDates.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No available dates found
                                </div>
                            ) : (
                                <Calendar
                                    mode="single"
                                    selected={localDate && !isNaN(localDate.getTime()) ? localDate : undefined}
                                    defaultMonth={getDefaultMonth()}
                                    captionLayout="dropdown"
                                    disabled={isDateDisabled}
                                    onSelect={handleDateSelect}
                                />
                            )}
                        </PopoverContent>
                    </Popover>
                </Field>

                <Field className="w-32">
                    {isTimeLoading ? (
                        <Input disabled placeholder="Loading..." />
                    ) : isAvailabilityMode && availableTimes && availableTimes.length === 0 && selectedDate ? (
                        <Input disabled placeholder="No times" />
                    ) : (
                        <select
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                            value={getCurrentTimeString()}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            disabled={isTimePickerDisabled}
                        >
                            <option value="">Select time</option>
                            {isAvailabilityMode && availableTimes ? (
                                availableTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))
                            ) : (
                                // If not in availability mode, show default time options
                                Array.from({ length: 24 * 4 }, (_, i) => {
                                    const hours = Math.floor(i / 4);
                                    const minutes = (i % 4) * 15;
                                    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                                    return (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    );
                                })
                            )}
                        </select>
                    )}
                </Field>
            </FieldGroup>

            <FieldError errors={[form.formState.errors[name] as { message?: string }]} />
        </Field>
    );
}