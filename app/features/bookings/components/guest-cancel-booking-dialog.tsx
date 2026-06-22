import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "~/features/bookings/api/booking-api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Booking } from "../type/booking";

interface GuestCancelBookingDialogProps {
    booking: Booking;
    token: string;
}

export function GuestCancelBookingDialog({ booking, token }: GuestCancelBookingDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const cancelMutation = useMutation({
        mutationFn: () => bookingApi.guestCancel(token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guest-booking", token] });
        },
    });

    async function handleCancelBooking() {
        const mutationPromise = cancelMutation.mutateAsync();

        toast.promise(mutationPromise, {
            loading: "Membatalkan booking...",
            success: () => {
                setOpen(false);
                queryClient.invalidateQueries({ queryKey: ["guest-booking", token] });
                return `Booking ${booking.booking_code} berhasil dibatalkan`;
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

                return "Gagal membatalkan booking";
            },
        });

        try {
            await mutationPromise;
        } catch {
            // handled by toast
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white w-full">
                    <X className="w-4 h-4 mr-2" /> Batalkan Booking
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin ingin membatalkan booking “{booking.booking_code}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Booking ini akan dibatalkan secara permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleCancelBooking()}>
                        Ya, Batalkan
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
