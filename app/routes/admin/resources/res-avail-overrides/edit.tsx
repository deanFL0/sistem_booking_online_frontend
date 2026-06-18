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
import { FormTextarea } from "~/components/form-input/form-textarea";
import { FormSelect } from "~/components/form-input/form-select";
import { resAvailOverrideSchema, type ResAvailOverrideSchema } from "~/features/resources/schema/res-avail-override";
import { resAvailOverrideApi } from "~/features/resources/api/res-avail-override-api";
import { FormDateTimePicker } from "~/components/form-input/form-datetime-picker";
import { useEffect } from "react";

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

export default function EditResAvailOverridePage() {
    const navigate = useNavigate();
    const { resourceId, overrideId } = useParams<{ resourceId: string; overrideId: string }>();
    const queryClient = useQueryClient();

    const form = useForm<ResAvailOverrideSchema>({
        resolver: zodResolver(resAvailOverrideSchema),
    });

    // Fetch resource data
    const { data: override, isLoading: isLoadingOverride } = useQuery({
        queryKey: ["res-avail-override", overrideId],
        queryFn: () => resAvailOverrideApi.getById(resourceId as string, overrideId as string),
        enabled: !!overrideId,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (override) {
            form.reset({
                start_datetime: override.start_datetime,
                end_datetime: override.end_datetime,
                status: override.status,
                reason: override.reason,
            });
        }
    }, [override, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ResAvailOverrideSchema) => resAvailOverrideApi.update(resourceId as string, overrideId as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["res-avail-overrides"] });
        },
    });

    async function onSubmit(values: ResAvailOverrideSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = updateMutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Sumber Daya...",
            success: () => {
                setTimeout(() => {
                    navigate(`/admin/resources/${resourceId}`);
                }, 1000);
                return `Penyesuaian Ketersediaan berhasil diubah`;
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
                return "Gagal mengubah Penyesuaian Ketersediaan";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof ResAvailOverrideSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    if (isLoadingOverride) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Penyesuaian Ketersediaan"
                        description="Memuat data Penyesuaian Ketersediaan..."
                        backHref={`/admin/resources/${resourceId}`}
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

    if (!override) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Penyesuaian Ketersediaan"
                        description="Penyesuaian Ketersediaan tidak ditemukan"
                        backHref={`/admin/resources/${resourceId}`}
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Penyesuaian Ketersediaan tidak ditemukan
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
                    title="Buat Penyesuaian Ketersediaan Baru"
                    description="Form untuk membuat Penyesuaian Ketersediaan baru"
                    backHref={`/admin/resources/${resourceId}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Penyesuaian Ketersediaan</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <div className="flex items-center justify-between gap-4">
                                    <FormDateTimePicker
                                        form={form}
                                        name="start_datetime"
                                        label="Tanggal & Waktu Mulai"
                                        disablePastDates={true}
                                    />
                                    <FormDateTimePicker
                                        form={form}
                                        name="end_datetime"
                                        label="Tanggal & Waktu Selesai"
                                        disablePastDates={true}
                                    />
                                </div>
                                <FormSelect
                                    form={form}
                                    name="status"
                                    label="Status"
                                    placeholder="Pilih Status"
                                    options={[
                                        {
                                            value: "available",
                                            label: "Tersedia",
                                        },
                                        {
                                            value: "unavailable",
                                            label: "Tidak Tersedia",
                                        },
                                    ]}
                                />
                                <FieldGroup>
                                    <FormTextarea
                                        form={form}
                                        name="reason"
                                        label="Alasan"
                                        placeholder="Masukkan Alasan"
                                    />
                                </FieldGroup>
                            </FieldGroup>

                            <Button
                                type="submit"
                                disabled={
                                    updateMutation.isPending
                                }
                            >
                                {updateMutation.isPending
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