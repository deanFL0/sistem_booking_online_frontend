import type { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

type FormImageProps<T extends FieldValues> = {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    disabled?: boolean;
    existingImage?: string | null;
};

export function FormImage<T extends FieldValues>({
    form,
    name,
    label,
    disabled,
    existingImage,
}: FormImageProps<T>) {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [preview, setPreview] = useState<string | null>(existingImage || null);

    useEffect(() => {
        if (!file) {
            setPreview(existingImage ?? null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [file, existingImage]);

    return (
        <Field>
            <FieldLabel>{label}</FieldLabel>

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="h-40 w-full rounded-md border object-contain"
                />
            )}

            <Input
                type="file"
                accept="image/*"
                disabled={disabled}
                aria-invalid={
                    !!form.formState.errors[name]
                }
                onChange={(e) => {
                    const selectedFile = e.target.files?.[0];

                    if (!selectedFile) {
                        setFile(undefined);
                        form.setValue(
                            name,
                            undefined as PathValue<T, Path<T>>,
                            {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true,
                            }
                        );
                        form.clearErrors(name);
                        setPreview(existingImage ?? null);
                        return;
                    }

                    if (!selectedFile.type.startsWith("image/")) {
                        setFile(undefined);
                        form.setError(name, {
                            type: "manual",
                            message: "File harus berupa gambar",
                        });
                        e.target.value = "";
                        return;
                    }

                    const MAX_FILE_SIZE = 5 * 1024 * 1024;
                    if (selectedFile.size > MAX_FILE_SIZE) {
                        setFile(undefined);
                        form.setError(name, {
                            type: "manual",
                            message: "Gambar harus kurang dari 5MB",
                        });
                        e.target.value = "";
                        return;
                    }

                    setFile(selectedFile);
                    form.clearErrors(name);
                    form.setValue(
                        name,
                        selectedFile as PathValue<T, Path<T>>,
                        {
                            shouldDirty: true,
                            shouldValidate: true,
                            shouldTouch: true,
                        }
                    );
                }}
            />

            <FieldError
                errors={[
                    form.formState.errors[name] as {
                        message?: string;
                    },
                ]}
            />
        </Field>
    );
}