import { useMemo, useState } from "react";
import { PublicLayout } from "~/components/layout/public-layout";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "~/features/bookings/api/booking-api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { Booking } from "~/features/bookings/type/booking";
import { ArrowLeft, Calendar, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CancelBookingDialog } from "~/features/bookings/components/cancel-booking-dialog";
import { RescheduleBookingDialog } from "~/features/bookings/components/reschedule-booking-dialog";

const formatDistance = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return formatDistanceToNow(date, {
        addSuffix: true,
        locale: idLocale,
    });
};

const formatLocalized = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
    });
};

export function meta() {
    return [
        { title: "Detail Booking Tamu" },
        { name: "description", content: "Lihat detail booking dan kelola jadwal atau pembatalan." },
    ];
}

export default function GuestBookingDetailPage() {
    const navigate = useNavigate();
    const { bookingId } = useParams<{ bookingId: string }>();
    const [isOpenRescheduleDialog, setIsOpenRescheduleDialog] = useState(false);
    const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null);

    const { data: booking, isLoading, isError } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: async () => {
            return bookingApi.getById(bookingId!);
        },
        enabled: !!bookingId,
    });

    const canModify = booking && !["cancelled", "completed", "no_show"].includes(booking.status);

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="mx-auto max-w-5xl px-4 py-20 text-center">
                    <div className="text-lg font-medium">Memuat detail booking...</div>
                </div>
            </PublicLayout>
        );
    }

    if (isError || !booking) {
        return (
            <PublicLayout>
                <div className="mx-auto max-w-5xl px-4 py-20 text-center">
                    <div className="text-lg font-medium">Booking tidak ditemukan atau token tidak valid.</div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="mx-auto max-w-5xl px-4 py-10">
                <Button
                    size="lg"
                    className="mb-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold">Detail Booking</h1>
                            <p className="text-muted-foreground mt-1">Lihat informasi booking berdasarkan token tamu.</p>
                        </div>
                        <div className="space-y-1 text-right text-sm text-muted-foreground">
                            <div>Kode Booking: {booking.booking_code}</div>
                            <div>Status: {booking.status}</div>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{booking.name}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Pelanggan</Label>
                                <p>{booking.customer_name}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Email Pelanggan</Label>
                                <p>{booking.customer_email}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Nomor Telepon Pelanggan</Label>
                                <p>{booking.customer_phone ?? "-"}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Layanan</Label>
                                <p>{booking.service?.name ?? "-"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Durasi</Label>
                                <p>{booking.duration_minutes} Menit</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Harga Total</Label>
                                <p>{booking.formatted_total_price}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Waktu mulai</Label>
                                <p>{formatLocalized(booking.start_datetime)}</p>
                                <p className="text-xs text-muted-foreground">{formatDistance(booking.start_datetime)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Waktu selesai</Label>
                                <p>{formatLocalized(booking.end_datetime)}</p>
                                <p className="text-xs text-muted-foreground">{formatDistance(booking.end_datetime)}</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <p className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${booking.status === "pending"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "confirmed"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : booking.status === "ongoing"
                                            ? "bg-blue-100 text-blue-800"
                                            : booking.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : booking.status === "cancelled"
                                                    ? "bg-red-100 text-red-800"
                                                    : booking.status === "no_show"
                                                        ? "bg-gray-100 text-gray-800"
                                                        : ""
                                    }`}
                                >
                                    {booking.status}
                                </p>
                            </div>
                        </div>

                        {booking.has_conflict && (
                            <>
                                <Separator />
                                <div className="mb-4 rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-4">
                                    <div className="flex items-center gap-2">
                                        <X />
                                        <Label className="font-semibold">Booking ini bermasalah</Label>
                                    </div>
                                    <p className="font-medium">Detail Konflik:</p>
                                    <p>{booking.conflict_details}</p>
                                </div>
                            </>
                        )}

                        {canModify && (
                            <div className="flex flex-col gap-3 md:flex-row">
                                <CancelBookingDialog booking={booking} />
                                <Button
                                    className="bg-yellow-400 text-black hover:bg-yellow-300"
                                    onClick={() => {
                                        setRescheduleBooking(booking);
                                        setIsOpenRescheduleDialog(true);
                                    }}
                                >
                                    Ubah Jadwal Booking
                                    <Calendar className="ml-2" />
                                </Button>
                            </div>
                        )}

                        {!canModify && (
                            <div className="rounded-lg border border-muted p-4 bg-muted/50 text-sm text-muted-foreground">
                                Booking tidak bisa diubah karena status saat ini: <strong>{booking.status}</strong>.
                            </div>
                        )}

                        {isOpenRescheduleDialog && rescheduleBooking && (
                            <RescheduleBookingDialog
                                booking={rescheduleBooking}
                                open={isOpenRescheduleDialog}
                                onOpenChange={setIsOpenRescheduleDialog}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
