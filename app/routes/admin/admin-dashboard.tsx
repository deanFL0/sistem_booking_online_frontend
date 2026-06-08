import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { AdminLayout } from "~/components/admin/admin-layout"
import { getDashboardData } from "~/features/dashboard/api/getDashboardData";
import { BookingStatsChart } from "~/features/dashboard/components/booking-stats-chart";

export default function AdminDashboard() {
    const [range, setRange] = useState<
        "week" | "month" | "year"
    >("month");

    const { data, isLoading } = useQuery({
        queryKey: ["dashboard"],

        queryFn: getDashboardData,

        staleTime: 1000 * 60 * 5,
    });

    const bookingStats =
        data?.data.booking_stats?.[range] ?? [];

    return (
        <AdminLayout>
            <BookingStatsChart
                data={bookingStats}
                range={range}
                onRangeChange={setRange}
                isLoading={isLoading}
            />
        </AdminLayout>
    );
}