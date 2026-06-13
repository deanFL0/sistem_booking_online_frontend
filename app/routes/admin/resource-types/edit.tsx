import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { useEffect } from "react";
import { resourceTypeSchema, type ResourceTypeSchema } from "~/features/resource-types/schema/resource-types-schema";
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
        try {
            await toast.promise(
                updateMutation.mutateAsync(values),
                {
                    loading: "Menyimpan perubahan...",
                }
            );

            toast.success("Tipe Sumber Daya berhasil diperbarui", {
                description: `${values.name} telah diperbarui`,
            });

            setTimeout(() => {
                navigate("/admin/resource-types");
            }, 1000);
        } catch (error) {
            toast.error("Gagal memperbarui Tipe Sumber Daya");
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
                                <Field>
                                    <FieldLabel>
                                        Nama Tipe Sumber Daya
                                    </FieldLabel>
                                    <Input
                                        {...form.register("name")}
                                        aria-invalid={!!form.formState.errors.name}
                                    />
                                    <FieldError
                                        message={form.formState.errors.name?.message}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Deskripsi
                                    </FieldLabel>
                                    <Textarea {...form.register("description")} />
                                    <FieldError
                                        message={form.formState.errors.description?.message}
                                    />
                                </Field>
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