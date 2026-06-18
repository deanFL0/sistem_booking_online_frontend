import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { AdminPage } from "~/components/admin/admin-page";
import { FieldGroup } from "~/components/ui/field";
import { serviceApi } from "~/features/services/api/service-api";
import { serviceSchema, type ServiceSchema } from "~/features/services/schema/service-create-schema";
import { useEffect } from "react";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormSelect } from "~/components/form-input/form-select";
import { FormTextarea } from "~/components/form-input/form-textarea";
import { Button } from "~/components/ui/button";

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

export default function EditServicePage() {
    const navigate = useNavigate();
    const { serviceId } = useParams<{ serviceId: string }>();
    const queryClient = useQueryClient();

    const form = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    // Fetch service data
    const { data: service, isLoading: isLoadingService } = useQuery({
        queryKey: ["service", serviceId],
        queryFn: () => serviceApi.getById(serviceId!),
        enabled: !!serviceId,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (service) {
            form.reset({
                name: service.name,
                description: service.description,
                price: service.price,
                pricing_type: service.pricing_type,
                duration: service.duration,
                is_active: service.is_active,
            });
        }
    }, [service, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ServiceSchema) => serviceApi.update(serviceId!, data),
        onSuccess: () => {
            // Invalidate and refetch both the list and the individual service
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["service", serviceId] });
        },
    });

    async function onSubmit(values: ServiceSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = updateMutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Layanan...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/services");
                }, 1000);
                return `Layanan ${values.name} berhasil diubah`;
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
                return "Gagal mengubah Layanan";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof ServiceSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    if (isLoadingService) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Layanan"
                        description="Memuat data layanan..."
                        backHref="/admin/services"
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

    if (!service) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Layanan"
                        description="Layanan tidak ditemukan"
                        backHref="/admin/services"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Layanan tidak ditemukan
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
                    title="Edit Layanan"
                    description="Form untuk mengedit layanan"
                    backHref="/admin/services"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Layanan</CardTitle>
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
                                    label="Nama Layanan"
                                />
                                <FormTextarea
                                    form={form}
                                    name="description"
                                    label="Deskripsi"
                                />
                                <div className="flex items-center justify-between gap-2">
                                    <FormInputGroup
                                        form={form}
                                        name="price"
                                        label="Harga"
                                        type="number"
                                        addon
                                        addonText="Rp"
                                    />
                                    <FormSelect
                                        form={form}
                                        name="pricing_type"
                                        label="Tipe Harga"
                                        placeholder="Pilih Tipe Harga"
                                        options={[
                                            {
                                                value: "one_time",
                                                label: "Sekali Bayar",
                                            },
                                            {
                                                value: "hourly",
                                                label: "Per Jam",
                                            },
                                        ]}
                                    />
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <FormInputGroup
                                        form={form}
                                        name="duration"
                                        label="Durasi"
                                        type="number"
                                        addon
                                        addonText="Menit"
                                        addonPosition="inline-end"
                                    />
                                    <FormSelect
                                        form={form}
                                        name="is_active"
                                        label="Status Layanan"
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
                                    onClick={() => navigate("/admin/services")}
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