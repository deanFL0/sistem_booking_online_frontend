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
import { serviceApi } from "~/features/services/api/service-api";
import { serviceSchema, type ServiceSchema } from "~/features/services/schema/service-schema";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormTextarea } from "~/components/form-input/form-textarea";
import { FormSelect } from "~/components/form-input/form-select";
import { FormImage } from "~/components/form-input/form-image";

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

export default function CreateServicePage() {
    const navigate = useNavigate();

    const form = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: serviceApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["services"]
            });
        }
    });

    async function onSubmit(values: ServiceSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = mutation.mutateAsync(values);

        console.log(values)
        toast.promise(mutationPromise, {
            loading: "Menyimpan Layanan...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/services");
                }, 1000);
                return `Layanan ${values.name} berhasil dibuat`;
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
                return "Gagal membuat Layanan";
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

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Buat Layanan Baru"
                    description="Form untuk membuat layanan baru"
                    backHref="/admin/services"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Layanan</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <FormImage
                                    form={form}
                                    name="image"
                                    label="Gambar"
                                />

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