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
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormSelect } from "~/components/form-input/form-select";
import { FormTextarea } from "~/components/form-input/form-textarea";
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

export default function EditResourcePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const form = useForm<ResourceSchema>({
        resolver: zodResolver(resourceSchema),
    });

    // Fetch resource data
    const { data: resource, isLoading: isLoadingResource } = useQuery({
        queryKey: ["resource", id],
        queryFn: () => resourceApi.getById(id!),
        enabled: !!id,
    });

    // Fetch resource types options
    const resourceTypesQuery = useQuery({
        queryKey: ["resource-types-options"],
        queryFn: () => ResourceTypesApi.getAllResourceTypes(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (resource) {
            form.reset({
                name: resource.name,
                description: resource.description,
                resource_type_id: String(resource.resource_type_id),
                is_active: resource.is_active,
            });
        }
    }, [resource, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ResourceSchema) => resourceApi.update(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            queryClient.invalidateQueries({ queryKey: ["resource", id] });
        },
    });

    async function onSubmit(values: ResourceSchema) {
        try {
            await toast.promise(
                updateMutation.mutateAsync(values),
                {
                    loading: "Menyimpan perubahan...",
                }
            );

            toast.success("Sumber Daya berhasil diperbarui", {
                description: `${values.name} telah diperbarui`,
            });

            setTimeout(() => {
                navigate("/admin/resources");
            }, 1000);
        } catch (error) {
            toast.error("Gagal memperbarui Sumber Daya");
        }
    }

    if (isLoadingResource) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Sumber Daya"
                        description="Memuat data Sumber Daya..."
                        backHref="/admin/resources"
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

    if (!resource) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Sumber Daya"
                        description="Sumber Daya tidak ditemukan"
                        backHref="/admin/resources"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Sumber Daya tidak ditemukan
                            </div>
                        </CardContent>
                    </Card>
                </AdminPage>
            </AdminLayout>
        );
    }

    console.log(resource)

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Edit Sumber Daya"
                    description="Form untuk mengedit Sumber Daya"
                    backHref="/admin/resources"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Sumber Daya</CardTitle>
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
                                    onClick={() => navigate("/admin/resources")}
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