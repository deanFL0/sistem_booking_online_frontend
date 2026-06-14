import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { FieldGroup } from "~/components/ui/field";
import { useEffect } from "react";
import { resourceTypeSchema, type ResourceTypeSchema } from "~/features/resource-types/schema/resource-types-schema";
import { ResourceTypesApi } from "~/features/resource-types/api/resource-types-api";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormTextarea } from "~/components/form-input/form-textarea";

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

export default function EditResourceTypePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const form = useForm<ResourceTypeSchema>({
        resolver: zodResolver(resourceTypeSchema),
    });

    // Fetch resource types data
    const { data: resourceType, isLoading: isLoadingResourceType } = useQuery({
        queryKey: ["resource-type", id],
        queryFn: () => ResourceTypesApi.getById(id!),
        enabled: !!id,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (resourceType) {
            form.reset({
                name: resourceType.name,
                description: resourceType.description,
            });
        }
    }, [resourceType, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ResourceTypeSchema) => ResourceTypesApi.update(id!, data),
        onSuccess: () => {
            // Invalidate and refetch both the list and the individual resource type
            queryClient.invalidateQueries({ queryKey: ["resource-types"] });
            queryClient.invalidateQueries({ queryKey: ["resource-type", id] });
        },
    });

    async function onSubmit(values: ResourceTypeSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = updateMutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Tipe Sumber Daya...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/resource-types");
                }, 1000);
                return `Tipe Sumber Daya ${values.name} berhasil diubah`;
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
                return "Gagal mengubah Tipe Sumber Daya";
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

    if (isLoadingResourceType) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Tipe Sumber Daya"
                        description="Memuat data Tipe Sumber Daya..."
                        backHref="/admin/resource-types"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Memuat...
                            </div>
                        </CardContent>
                    </Card>
                </AdminPage>
            </AdminLayout>
        );
    }

    if (!resourceType) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Tipe Sumber Daya"
                        description="Tipe Sumber Daya tidak ditemukan"
                        backHref="/admin/resource-types"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Tipe Sumber Daya tidak ditemukan
                            </div>
                        </CardContent>
                    </Card>
                </AdminPage>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Edit Tipe Sumber Daya"
                    description="Form untuk mengedit Tipe Sumber Daya"
                    backHref="/admin/resource-types"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tipe Sumber Daya</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
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

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/admin/resource-types")}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}