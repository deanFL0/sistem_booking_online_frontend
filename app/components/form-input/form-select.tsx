import {
    Controller,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type SelectOption = {
    value: any;
    label: string;
};

type FormSelectProps<
    T extends FieldValues
> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
};

export function FormSelect<
    T extends FieldValues
>({
    form,
    name,
    label,
    placeholder = "Pilih opsi",
    options,
}: FormSelectProps<T>) {
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            <Controller
                name={name}
                control={form.control}
                render={({ field }) => (
                    <Select
                        value={field.value ?? null}
                        onValueChange={field.onChange}
                        items={options}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>

                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />

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