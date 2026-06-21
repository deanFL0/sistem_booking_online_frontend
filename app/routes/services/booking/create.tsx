import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FieldGroup } from "~/components/ui/field";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { bookingApi } from "~/features/bookings/api/booking-api";
import { bookingSchema, type BookingSchema } from "~/features/bookings/schema/booking-schema";
import { serviceApi } from "~/features/services/api/service-api";
import { FormDateTimePicker } from "~/components/form-input/form-datetime-picker";
import { useServiceAvailability } from "~/features/services/hooks/useServiceAvailability";
import { PublicLayout } from "~/components/layout/public-layout";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getUser } from "~/lib/auth";

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
    const { serviceId } = useParams<{ serviceId: string }>();
    const user = getUser();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<BookingSchema>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            user_id: user?.id,
            service_id: serviceId,
            customer_name: user?.name,
            customer_email: user?.email,
            customer_phone: user?.phone,
        }
    });

    const service = useQuery({
        queryKey: ["service", serviceId],
        queryFn: () => serviceApi.getById(serviceId!),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });

    const {
        availableDates,
        availableTimes,
        selectedDate,
        isLoading: datesLoading,
        isTimesLoading,
        error: availabilityError,
        selectDate,
    } = useServiceAvailability({
        serviceId,
        initialDate: null,
    });

    const mutation = useMutation({
        mutationFn: bookingApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["bookings"]
            });
        }
    });

    async function onSubmit(values: BookingSchema) {
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Booking...",
            success: (data) => {
                setTimeout(() => {
                    navigate("/admin/bookings");
                }, 1000);
                return `Booking ${data.data?.booking_code} berhasil dibuat`;
            },
            error: (error: any) => {
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

    return (
        <PublicLayout>
            {/* Back Button */}
            <Button
                size="lg"
                className="mb-4"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
            </Button>

            <div className="flex flex-col gap-6 lg:flex-row w-full">
                {/* Service Summary */}
                <Card className="lg:flex-1">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 md:flex-row">
                            <div className="md:w-60 lg:w-72 shrink-0">
                                <img
                                    src={service.data?.image_url || "/images/service-default.jpg"}
                                    alt={service.data?.name}
                                    className="h-48 sm:h-56 md:h-64 w-full rounded-lg object-cover border"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between gap-3">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-semibold line-clamp-2">
                                        {service.data?.name}
                                    </h2>

                                    <p className="mt-2 text-sm sm:text-base text-muted-foreground line-clamp-3">
                                        {service.data?.description}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <div className="rounded-lg border bg-muted/30 px-3 sm:px-4 py-2 sm:py-3">
                                        <p className="text-xs text-muted-foreground">
                                            Harga
                                        </p>
                                        <p className="font-semibold text-sm sm:text-base">
                                            {service.data?.formatted_total_price}
                                        </p>
                                    </div>

                                    {service.data?.duration_minutes && (
                                        <div className="rounded-lg border bg-muted/30 px-3 sm:px-4 py-2 sm:py-3">
                                            <p className="text-xs text-muted-foreground">
                                                Durasi
                                            </p>
                                            <p className="font-semibold text-sm sm:text-base">
                                                {service.data.duration_minutes} menit
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Booking Form */}
                <Card className="lg:w-[45%] xl:w-[40%]">
                    <CardContent className="p-4 sm:p-6">
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5 sm:space-y-6"
                        >
                            <FieldGroup className="space-y-4">
                                <FormInputGroup
                                    form={form}
                                    name="customer_name"
                                    label="Nama"
                                    placeholder="Masukkan nama lengkap"
                                />

                                <FormInputGroup
                                    form={form}
                                    type="email"
                                    name="customer_email"
                                    label="Email"
                                    placeholder="Masukkan alamat email"
                                />

                                <FormInputGroup
                                    form={form}
                                    name="customer_phone"
                                    label="Nomor Telepon"
                                    placeholder="Masukkan nomor telepon"
                                />

                                <FormDateTimePicker
                                    form={form}
                                    name="start_datetime"
                                    label="Tanggal Mulai Booking"
                                    availableDates={availableDates}
                                    availableTimes={availableTimes}
                                    selectedDate={selectedDate}
                                    onDateSelect={selectDate}
                                    isLoading={datesLoading}
                                    isTimesLoading={isTimesLoading}
                                    error={availabilityError}
                                    disablePastDates={true}
                                    timezone="Asia/Jakarta"
                                />
                            </FieldGroup>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <>
                                        <span className="mr-2">Menyimpan...</span>
                                        {/* Optional: Add spinner icon here */}
                                    </>
                                ) : (
                                    "Simpan Booking"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}