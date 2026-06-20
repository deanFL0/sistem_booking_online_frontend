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
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormSelect } from "~/components/form-input/form-select";
import { operationalHoursSchema, type OperationalHoursSchema } from "~/features/resources/schema/operational-hours-schema";
import { operationalHourApi } from "~/features/resources/api/operational-hours-api";
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

export default function AdminEditOperationalHoursPage() {
    const { resourceId, operationalHourId } = useParams<{ resourceId: string, operationalHourId: string }>();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<OperationalHoursSchema>({
        resolver: zodResolver(operationalHoursSchema),
    });

    // Fetch Operational hour data
    const { data: operationalHour, isLoading: isLoadingOperationalHour } = useQuery({
        queryKey: ["operational-hour", resourceId, operationalHourId],
        queryFn: () => operationalHourApi.getById(resourceId!, operationalHourId!),
        enabled: !!resourceId && !!operationalHourId,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (operationalHour) {
            form.reset({
                day_of_week: operationalHour.day_of_week,
                open_time: operationalHour.open_time,
                close_time: operationalHour.close_time,
                is_closed: operationalHour.is_closed,
            });
        }
    }, [operationalHour, form]);

    const updateMutation = useMutation({
        mutationFn: (data: OperationalHoursSchema) => operationalHourApi.update(resourceId!, operationalHourId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["operational-hours"] });
            queryClient.invalidateQueries({ queryKey: ["resource", resourceId] });
        },
    });

    async function onSubmit(values: OperationalHoursSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = updateMutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Jam Operasional...",
            success: () => {
                setTimeout(() => {
                    navigate(`/admin/resources/${resourceId}`);
                }, 1000);
                return `Jam Operasional berhasil diubah`;
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
                return "Gagal mengubah Jam Operasional";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof OperationalHoursSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    if (isLoadingOperationalHour) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Jam Operasional"
                        description="Memuat data Jam Operasional..."
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

    if (!operationalHour) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Jam Operasional"
                        description="Jam Operasional tidak ditemukan"
                        backHref={`/admin/resources/${resourceId}`}
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Jam Operasional tidak ditemukan
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
                    title="Edit Jam Operasi"
                    description="Form untuk mengedit Jam Operasi"
                    backHref={`/admin/resources/${resourceId}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Jam Operasi</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <FormSelect
                                    form={form}
                                    name="day_of_week"
                                    label="Hari"
                                    placeholder="Pilih Hari"
                                    options={[
                                        {
                                            value: 0,
                                            label: "Minggu",
                                        },
                                        {
                                            value: 1,
                                            label: "Senin",
                                        },
                                        {
                                            value: 2,
                                            label: "Selasa",
                                        },
                                        {
                                            value: 3,
                                            label: "Rabu",
                                        },
                                        {
                                            value: 4,
                                            label: "Kamis",
                                        },
                                        {
                                            value: 5,
                                            label: "Jumat",
                                        },
                                        {
                                            value: 6,
                                            label: "Sabtu",
                                        },
                                    ]}
                                />
                                <FormInputGroup
                                    form={form}
                                    name="open_time"
                                    label="Jam Buka"
                                    type="time"
                                />
                                <FormInputGroup
                                    form={form}
                                    name="close_time"
                                    label="Jam Tutup"
                                    type="time"
                                />
                                <FormSelect
                                    form={form}
                                    name="is_closed"
                                    label="Status"
                                    placeholder="Pilih Status"
                                    options={[
                                        {
                                            value: true,
                                            label: "Tutup",
                                        },
                                        {
                                            value: false,
                                            label: "Buka",
                                        },
                                    ]}
                                />
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