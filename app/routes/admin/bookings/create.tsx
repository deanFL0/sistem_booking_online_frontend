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
import { FormSelect } from "~/components/form-input/form-select";
import { bookingApi } from "~/features/bookings/api/booking-api";
import { bookingSchema, type BookingSchema } from "~/features/bookings/schema/booking-schema";
import { FormDatePicker } from "~/components/form-input/form-date-picker";
import { serviceApi } from "~/features/services/api/service-api";
import { FormSearchableSelect } from "~/components/form-input/form-searchable-select";
import { FormDateTimePicker } from "~/components/form-input/form-datetime-picker";

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

export default function CreateBookingPage() {
    const navigate = useNavigate();

    const form = useForm<BookingSchema>({
        resolver: zodResolver(bookingSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: bookingApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["booking"]
            });
        }
    });

    async function onSubmit(values: BookingSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Booking...",
            success: (data) => {
                setTimeout(() => {
                    navigate("/admin/bookings");
                }, 1000);
                return `Booking ${data.booking_code} berhasil dibuat`;
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
                return "Gagal membuat Booking";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof BookingSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    const serviceOptionsQuery = useQuery({
        queryKey: ["service-options"],
        queryFn: () => serviceApi.getAllServiceOption(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Buat Booking Baru"
                    description="Form untuk membuat Booking baru"
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