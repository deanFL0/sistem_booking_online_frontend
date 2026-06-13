import { Textarea } from "../ui/textarea";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";

type FormTextareaProps<
    T extends FieldValues
> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
};

export function FormTextarea<T extends FieldValues>(
    {
        form,
        name,
        label,
        placeholder,
        disabled,
    }: FormTextareaProps<T>
) {
    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>
            <Textarea
                {...form.register(name)}
                aria-invalid={
                    !!form.formState.errors[name]
                }
                placeholder={placeholder}
                disabled={disabled}
            />
            <FieldError
                errors={[form.formState.errors[name] as { message?: string }]}
            />
        </Field>
    );
}