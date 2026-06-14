import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { FieldGroup } from "~/components/ui/field";
import { resourceTypeSchema, type ResourceTypeSchema } from "~/features/resource-types/schema/resource-types-schema";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormTextarea } from "~/components/form-input/form-textarea";
import { ResourceTypesApi } from "~/features/resource-types/api/resource-types-api";

type FieldErrorProps = {
    message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;

    return (
        <p className="text-sm text-destructive">
            {message}
        </p>
    );
}

export default function CreateResourceTypePage() {
    const navigate = useNavigate();

    const form = useForm<ResourceTypeSchema>({
        resolver: zodResolver(resourceTypeSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ResourceTypesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["resource-types"]
            });
        }
    });

    async function onSubmit(values: ResourceTypeSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Tipe Sumber Daya...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/resource-types");
                }, 1000);
                return `Tipe Sumber Daya ${values.name} berhasil ditambahkan`;
            },
            error: (error: any) => {
                // Extract error message
                if (error.response?.data?.message) {
                    return error.response.data.message;
                }
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    const firstError = Object.values(errors)[0];
                    if (Array.isArray(firstError)) {
                        return firstError[0];
                    }
                    return String(firstError);
                }
                return "Gagal membuat Tipe Sumber Daya";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof ResourceTypeSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Buat Tipe Sumber Daya Baru"
                    description="Form untuk membuat Tipe Sumber Daya baru"
                    backHref="/admin/resource-types"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tipe Sumber Daya</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <FormInputGroup
                                    form={form}
                                    name="name"
                                    label="Nama Tipe Sumber Daya"
                                />
                                <FormTextarea
                                    form={form}
                                    name="description"
                                    label="Deskripsi"
                                />
                            </FieldGroup>

                            <Button
                                type="submit"
                                disabled={
                                    mutation.isPending
                                }
                            >
                                {mutation.isPending
                                    ? "Menyimpan..."
                                    : "Simpan"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}