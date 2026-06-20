import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { FieldGroup } from "~/components/ui/field";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormTextarea } from "~/components/form-input/form-textarea";
import { FormSelect } from "~/components/form-input/form-select";
import { FormSearchableSelect } from "~/components/form-input/form-searchable-select";
import { resourceSchema, type ResourceSchema } from "~/features/resources/schema/resource-schema";
import { resourceApi } from "~/features/resources/api/resource-api";
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

export default function AdminCreateResourcePage() {
    const navigate = useNavigate();

    const form = useForm<ResourceSchema>({
        resolver: zodResolver(resourceSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: resourceApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["resources"]
            });
        }
    });

    async function onSubmit(values: ResourceSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Sumber Daya...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/resources");
                }, 1000);
                return `Sumber Daya ${values.name} berhasil dibuat`;
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
                return "Gagal membuat Sumber Daya";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof ResourceSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    const resourceTypesQuery = useQuery({
        queryKey: ["resource-types-options"],
        queryFn: () => ResourceTypesApi.getAllResourceTypes(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Buat Sumber Daya Baru"
                    description="Form untuk membuat Sumber Daya baru"
                    backHref="/admin/resources"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Sumber Daya</CardTitle>
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
                                    label="Nama Sumber Daya"
                                />
                                <FormTextarea
                                    form={form}
                                    name="description"
                                    label="Deskripsi"
                                />
                                <div className="flex items-center justify-between gap-2">
                                    <FormSearchableSelect
                                        form={form}
                                        name="resource_type_id"
                                        label="Tipe Sumber Daya"
                                        placeholder="Pilih Tipe Sumber Daya"
                                        options={
                                            resourceTypesQuery.data?.map((item: any) => ({
                                                value: String(item.id),
                                                label: item.name,
                                            })) || []
                                        }
                                    />
                                    <FormSelect
                                        form={form}
                                        name="is_active"
                                        label="Status Sumber Daya"
                                        placeholder="Pilih Status"
                                        options={[
                                            {
                                                value: true,
                                                label: "Aktif",
                                            },
                                            {
                                                value: false,
                                                label: "Nonaktif",
                                            },
                                        ]}
                                    />
                                </div>
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