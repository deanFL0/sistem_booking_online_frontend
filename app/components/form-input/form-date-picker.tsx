import { useState } from "react";
import type {
    FieldValues,
    Path,
    UseFormReturn,
} from "react-hook-form";

import { CalendarIcon } from "lucide-react";

import { Field, FieldError, FieldLabel } from "../ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "../ui/input-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { Calendar } from "../ui/calendar";

type FormDatePickerProps<
    T extends FieldValues
> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    disabled?: boolean;
};

export function FormDatePicker<
    T extends FieldValues
>({
    form,
    name,
    label,
    placeholder = "Pilih Tanggal",
    disabled,
}: FormDatePickerProps<T>) {
    const [open, setOpen] = useState(false);

    const value = form.watch(name);

    const selectedDate = value
        ? new Date(value)
        : undefined;

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            <InputGroup>
                <InputGroupInput
                    value={
                        selectedDate
                            ? selectedDate.toLocaleDateString()
                            : ""
                    }
                    placeholder={placeholder}
                    readOnly
                    disabled={disabled}
                />

                <InputGroupAddon align="inline-end">
                    <Popover
                        open={open}
                        onOpenChange={setOpen}
                    >
                        <PopoverTrigger
                            render={
                                <InputGroupButton
                                    variant="ghost"
                                    size="icon-xs"
                                >
                                    <CalendarIcon />
                                </InputGroupButton>
                            }
                        />

                        <PopoverContent
                            className="w-auto p-0"
                        >
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    form.setValue(
                                        name,
                                        date?.toISOString() as any,
                                        {
                                            shouldDirty: true,
                                            shouldTouch: true,
                                            shouldValidate: true,
                                        }
                                    );

                                    setOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </InputGroupAddon>
            </InputGroup>

            <FieldError
                errors={[
                    form.formState.errors[
                    name
                    ] as {
                        message?: string;
                    },
                ]}
            />
        </Field>
    );
}