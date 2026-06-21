import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { Booking } from "../type/booking";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Calendar, Clock, MapPin, User, CreditCard, AlertCircle, CheckCircle, XCircle, Clock as ClockIcon, Loader2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface BookingCardProps {
    booking: Booking;
}

const statusConfig = {
    pending: {
        label: "Menunggu Konfirmasi",
        variant: "warning" as const,
        icon: ClockIcon,
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    },
    confirmed: {
        label: "Dikonfirmasi",
        variant: "success" as const,
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 border-green-200",
    },
    ongoing: {
        label: "Sedang Berlangsung",
        variant: "info" as const,
        icon: Loader2,
        color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    completed: {
        label: "Selesai",
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-gray-600 bg-gray-50 border-gray-200",
    },
    cancelled: {
        label: "Dibatalkan",
        variant: "destructive" as const,
        icon: XCircle,
        color: "text-red-600 bg-red-50 border-red-200",
    },
    no_show: {
        label: "Tidak Hadir",
        variant: "destructive" as const,
        icon: AlertCircle,
        color: "text-orange-600 bg-orange-50 border-orange-200",
    },
};

export function BookingCard({ booking }: BookingCardProps) {
    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const formatDate = (date: string) => {
        return format(new Date(date), "EEEE, d MMMM yyyy", { locale: id });
    };

    const formatTime = (date: string) => {
        return format(new Date(date), "HH:mm", { locale: id });
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            {/* Status Bar */}
            <div className={`h-1.5 w-full ${status.color.split(' ')[0].replace('text-', 'bg-')}`} />

            <CardHeader className="space-y-2 pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                            {booking.service?.name || "Layanan"}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1">
                            <CreditCard className="h-3.5 w-3.5" />
                            <span className="font-mono text-xs tracking-wider">
                                {booking.booking_code}
                            </span>
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className={`${status.color} border px-2.5 py-0.5 text-xs font-medium flex-shrink-0`}
                    >
                        <StatusIcon className={`h-3 w-3 mr-1 ${status.icon === Loader2 ? 'animate-spin' : ''}`} />
                        {status.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Tanggal</span>
                        </div>
                        <div className="text-sm font-medium">
                            {formatDate(booking.start_datetime)}
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Waktu</span>
                        </div>
                        <div className="text-sm font-medium">
                            {formatTime(booking.start_datetime)} - {formatTime(booking.end_datetime)}
                        </div>
                    </div>
                </div>

                {/* Service Details */}
                <div className="space-y-2 text-sm">
                    {booking.service?.name && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-xs font-medium uppercase tracking-wider">Layanan:</span>
                            <span className="font-medium text-foreground">{booking.service.name}</span>
                        </div>
                    )}
                    {booking.service?.duration && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-xs font-medium uppercase tracking-wider">Durasi:</span>
                            <span className="font-medium text-foreground">{booking.service.duration} menit</span>
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Total Harga</span>
                    <span className="text-lg font-bold text-primary">
                        {booking.formatted_total_price || "Rp 0"}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                        variant="default"
                        size="sm"
                        className="flex-1 min-w-[150px]"
                    >
                        <Link to={`/my-bookings/${booking.id}/`}>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                Lihat Detail
                            </div>
                        </Link>
                    </Button>

                    {(booking.status === "pending" || booking.status === "confirmed") && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 min-w-[150px]"
                        >
                            <Link to={`/my-bookings/${booking.id}/cancel`}>
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Batalkan
                                </div>
                            </Link>
                        </Button>
                    )}

                    {(booking.status === "confirmed" || booking.status === "ongoing") && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[150px]"
                        >
                            <Link to={`/my-bookings/${booking.id}/reschedule`}>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                    Jadwal Ulang
                                </div>
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}