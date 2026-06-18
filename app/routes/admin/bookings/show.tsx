import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { Link, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { bookingApi } from "~/features/bookings/api/booking-api";
import { ArrowUpRight, Calendar, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CancelBookingDialog } from "~/features/bookings/components/cancel-booking-dialog";
import { useState } from "react";
import { RescheduleBookingDialog } from "~/features/bookings/components/reschedule-booking-dialog";
import type { Booking } from "~/features/bookings/type/booking";

export default function BookingDetailPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const [isOpenCancelDialog, setIsOpenCancelDialog] = useState(false);
    const [isOpenRescheduleDialog, setIsOpenRescheduleDialog] = useState(false);
    const [rescheduleBooking, setRescheduleBooking] =
        useState<Booking | null>(null);

    const { data: booking } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: async () => {
            const res = await bookingApi.getById(bookingId!);
            return res;
        },
        enabled: !!bookingId,
    });

    if (!booking) {
        return (
            <AdminLayout>
                <AdminPage>
                    <div>Loading...</div>
                </AdminPage>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Detail Booking"
                    description="Detail Booking yang tersedia"
                    backHref="/admin/bookings"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{booking.name}</CardTitle>
                        <CardDescription>
                            <div className="grid grid-cols-2 gap-4">
                                <p>ID: {booking.id}</p>
                                <p>Kode Booking: {booking.booking_code}</p>
                            </div>

                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
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

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Layanan</Label>
                                <p>{booking.service.name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Durasi</Label>
                                <p>{booking.duration_minutes} Menit</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Harga Total</Label>
                                <p>
                                    {Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        maximumFractionDigits: 0,
                                    }).format(booking.total_price)}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Waktu mulai</Label>
                                <p>{new Date(booking.start_datetime).toLocaleString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZoneName: "short",
                                })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                        new Date(booking.start_datetime),
                                        {
                                            addSuffix: true,
                                            locale: idLocale,
                                        }
                                    )}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Waktu selesai</Label>
                                <p>{new Date(booking.end_datetime).toLocaleString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZoneName: "short",
                                })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                        new Date(booking.end_datetime),
                                        {
                                            addSuffix: true,
                                            locale: idLocale,
                                        }
                                    )}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <p className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${(booking.status === "pending")
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
                                    }`}>
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
                                <div className="flex gap-2">
                                    <CancelBookingDialog booking={booking} />
                                    <Button
                                        className={"bg-yellow-400 text-black hover:bg-yellow-300"}
                                        onClick={() => {
                                            setIsOpenRescheduleDialog(true);
                                            setRescheduleBooking(booking);
                                        }}
                                    >
                                        Jadwalkan ulang Booking
                                        <Calendar />
                                    </Button>
                                    <Button
                                        className={"bg-yellow-400 text-black hover:bg-yellow-300"}
                                        render={
                                            <Link to={`/admin/bookings/${booking.id}/edit`}>
                                                Atur Ulang Booking
                                                <ArrowUpRight />
                                            </Link>
                                        }
                                    />
                                </div>
                            </>
                        )}

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dibuat</Label>
                                <div>
                                    <p>{new Date(booking.created_at).toLocaleString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZoneName: "short",
                                    })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(booking.created_at),
                                            {
                                                addSuffix: true,
                                                locale: idLocale,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Terakhir Diperbarui</Label>
                                <div>
                                    <p>{new Date(booking.updated_at).toLocaleString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZoneName: "short",
                                    })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(booking.updated_at),
                                            {
                                                addSuffix: true,
                                                locale: idLocale,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isOpenRescheduleDialog && rescheduleBooking && (
                            <RescheduleBookingDialog
                                booking={rescheduleBooking}
                                open={isOpenRescheduleDialog}
                                onOpenChange={setIsOpenRescheduleDialog}
                            />
                        )}
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout >
    );
}