import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { Button } from "~/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Booking } from "../type/booking";
import { bookingApi } from "../api/booking-api";
import { rescheduleBookingSchema, type RescheduleBookingSchema } from "../schema/reschedule-booking-schema";
import { FormDateTimePicker } from "~/components/form-input/form-datetime-picker";
import { useServiceAvailability } from "~/features/services/hooks/useServiceAvailability";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

type RescheduleBookingDialogProps = {
    booking: Booking;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RescheduleBookingDialog({
    booking,
    open,
    onOpenChange,
}: RescheduleBookingDialogProps) {
    const queryClient = useQueryClient();
    const {
        availableDates,
        availableTimes,
        selectedDate,
        isLoading: datesLoading,
        isTimesLoading,
        error: availabilityError,
        selectDate,
    } = useServiceAvailability({
        serviceId: booking.service_id,
        initialDate: null,
    });

    const form = useForm({
        defaultValues: {
            start_datetime: booking.start_datetime,
        },
    });

    // Reset form when booking changes
    useEffect(() => {
        if (booking) {
            form.reset({
                start_datetime: booking.start_datetime,
            });
        }
    }, [booking, form]);

    const mutation = useMutation({
        mutationFn: (data: RescheduleBookingSchema) =>
            bookingApi.reschedule(booking.id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
        },
    });

    async function onSubmit(values: RescheduleBookingSchema) {
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menjadwalkan ulang Booking...",
            success: () => {
                onOpenChange(false);
                queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
                queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
                return `Booking ${booking.booking_code} berhasil dijadwalkan ulang`;
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
                return "Gagal mengubah Pengguna";
            },
        });

        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof RescheduleBookingSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : (messages as string),
                    });
                });
            }
        }
    }

    // Check if form is submitting or loading availability
    const isSubmitting = mutation.isPending;
    const isLoading = datesLoading || isTimesLoading;
    const isSubmitDisabled = isSubmitting || isLoading;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ubah Jadwal Booking</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                    {/* Show loading indicator for availability */}
                    {isLoading && (
                        <div className="text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Memuat jadwal tersedia...
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitDisabled}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}