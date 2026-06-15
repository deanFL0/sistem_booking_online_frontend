import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

type FormInputGroupProps<
    T extends FieldValues
> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    addon?: boolean;
    addonText?: string;
    addonPosition?: "inline-start" | "inline-end" | "block-start" | "block-end";
};

export function FormInputGroup<T extends FieldValues>({
    form,
    name,
    label,
    type = "text",
    placeholder,
    disabled,
    addon = false,
    addonText,
    addonPosition = "inline-start",
}: FormInputGroupProps<T>) {
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <InputGroup>
                {addon && (
                    <InputGroupAddon align={addonPosition}>{addonText}</InputGroupAddon>
                )}
                <InputGroupInput
                    {...form.register(name, { valueAsNumber: type === "number" })}
                    aria-invalid={
                        !!form.formState.errors[name]
                    }
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </InputGroup>

            <FieldError
                errors={[form.formState.errors[name] as { message?: string }]}
            />
        </Field>
    );
}