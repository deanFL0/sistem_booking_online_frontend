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
import { bookingApi } from "~/features/bookings/api/booking-api";
import { serviceApi } from "~/features/services/api/service-api";
import { FormSearchableSelect } from "~/components/form-input/form-searchable-select";
import { FormDateTimePicker } from "~/components/form-input/form-datetime-picker";
import { useEffect } from "react";
import { FormSelect } from "~/components/form-input/form-select";
import { updateBookingSchema, type UpdateBookingSchema } from "~/features/bookings/schema/booking-schema";

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

export default function EditBookingPage() {
    const navigate = useNavigate();
    const { bookingId } = useParams<{ bookingId: string }>();
    const queryClient = useQueryClient();

    const form = useForm<UpdateBookingSchema>({
        resolver: zodResolver(updateBookingSchema),
    });

    // Fetch booking data
    const { data: booking, isLoading: isLoadingBooking } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => bookingApi.getById(bookingId!),
        enabled: !!bookingId,
    });

    // Fetch service options data
    const serviceOptionsQuery = useQuery({
        queryKey: ["service-options"],
        queryFn: () => serviceApi.getAllServiceOption(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (booking) {
            form.reset({
                booking_code: booking.booking_code,
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
                customer_phone: booking.customer_phone,
                service_id: String(booking.service_id),
                start_datetime: booking.start_datetime,
                status: booking.status,
            });
        }
    }, [booking, form]);

    const updateMutation = useMutation({
        mutationFn: (data: UpdateBookingSchema) => bookingApi.update(bookingId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
        },
    });

    async function onSubmit(values: UpdateBookingSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = updateMutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Booking...",
            success: (data) => {
                setTimeout(() => {
                    navigate("/admin/bookings");
                }, 1000);
                return `Booking ${data.data?.booking_code} berhasil diubah`;
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
                return "Gagal mengubah Booking";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof UpdateBookingSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    if (isLoadingBooking) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Booking"
                        description="Memuat data Booking..."
                        backHref="/admin/bookings"
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

    if (!booking) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Booking"
                        description="Booking tidak ditemukan"
                        backHref="/admin/bookings"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Booking tidak ditemukan
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
                    title="Edit Booking"
                    description="Form untuk mengedit Booking"
                    backHref="/admin/bookings"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Booking</CardTitle>
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
                                    name="booking_code"
                                    label="Kode Booking"
                                    disabled
                                />

                                <FormSearchableSelect
                                    form={form}
                                    name="service_id"
                                    label="Layanan"
                                    placeholder="Pilih Layanan"
                                    options={
                                        serviceOptionsQuery.data?.map((item: any) => ({
                                            value: String(item.id),
                                            label: item.name,
                                        })) || []
                                    }
                                />

                                <FormInputGroup
                                    form={form}
                                    name="customer_name"
                                    label="Nama Pelanggan"
                                />

                                <FormInputGroup
                                    form={form}
                                    type="email"
                                    name="customer_email"
                                    label="Email Pelanggan"
                                />

                                <FormInputGroup
                                    form={form}
                                    name="customer_phone"
                                    label="Nomor Telepon Pelanggan"
                                />

                                <FormDateTimePicker
                                    form={form}
                                    name="start_datetime"
                                    label="Tanggal Mulai Booking"
                                />

                                <FormSelect
                                    form={form}
                                    name="status"
                                    label="Status"
                                    options={[
                                        { value: "pending", label: "Menunggu Konfirmasi" },
                                        { value: "confirmed", label: "Terkonfirmasi" },
                                        { value: "ongoing", label: "Sedang Berlangsung" },
                                        { value: "completed", label: "Selesai" },
                                        { value: "cancelled", label: "Dibatalkan" },
                                        { value: "no_show", label: "Tidak Datang" },
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