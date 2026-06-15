import { useState } from "react";
import type {
    FieldValues,
    Path,
    UseFormReturn,
} from "react-hook-form";
import { format, parse } from "date-fns";
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
};

export function FormDateTimePicker<
    T extends FieldValues
>({
    form,
    name,
    label,
    disablePastDates = false,
}: FormDateTimePickerProps<T>) {
    const [open, setOpen] = useState(false);

    const value = form.watch(name) as
        | string
        | undefined;

    // Parse string to Date for display
    const selectedDate = value
        ? parse(value, "yyyy-MM-dd HH:mm:ss", new Date())
        : undefined;

    const updateDate = (
        datePart: Date | undefined,
        timePart?: string
    ) => {
        if (!datePart) {
            form.setValue(
                name,
                "" as any
            );
            return;
        }

        const date = new Date(datePart);

        if (timePart) {
            const [hours, minutes] =
                timePart.split(":");

            date.setHours(
                Number(hours),
                Number(minutes),
                0,
                0
            );
        } else if (selectedDate) {
            date.setHours(
                selectedDate.getHours(),
                selectedDate.getMinutes(),
                0,
                0
            );
        }

        // Format as PostgreSQL timestamp without timezone
        const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");

        form.setValue(
            name,
            formattedDate as any,
            {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            }
        );
    };

    const getCurrentTimeString = () => {
        if (selectedDate) {
            return `${String(selectedDate.getHours()).padStart(2, "0")}:${String(selectedDate.getMinutes()).padStart(2, "0")}`;
        }
        return "00:00";
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
                                    {selectedDate
                                        ? format(selectedDate, "PPP")
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
                                selected={selectedDate}
                                defaultMonth={selectedDate}
                                captionLayout="dropdown"
                                disabled={
                                    disablePastDates
                                        ? (date) =>
                                            date <
                                            new Date(
                                                new Date().setHours(
                                                    0,
                                                    0,
                                                    0,
                                                    0
                                                )
                                            )
                                        : undefined
                                }
                                onSelect={(date) => {
                                    updateDate(date);
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
                            // If no date is selected, use today's date
                            const baseDate = selectedDate ?? new Date();
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