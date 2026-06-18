import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingApi } from "../api/booking-api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Calendar, Check, Clock, X } from "lucide-react";
import { toast } from "sonner";
import type { Booking } from "../type/booking";

interface CancelBookingDialogProps {
    booking: Booking;
}

export function CancelBookingDialog({ booking }: CancelBookingDialogProps) {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const cancelMutation = useMutation({
        mutationFn: () => bookingApi.cancel(booking.id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });

    async function handleCancelBooking() {
        const mutationPromise = cancelMutation.mutateAsync();

        toast.promise(mutationPromise, {
            loading: "Membatalkan Booking...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/bookings");
                }, 1000);

                setOpen(false);

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

                return "Gagal membatalkan Booking";
            },
        });

        try {
            await mutationPromise;
        } catch {
            // Error already handled by toast.promise
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                    <X className="w-4 h-4 mr-2" />
                    Batalkan Booking
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apakah anda yakin ingin membatalkan booking “{booking.booking_code}”?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Jika ya, klik "Ya" untuk membatalkan booking.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={() => handleCancelBooking()}>Ya</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}