import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { AdminLayout } from "~/components/admin/admin-layout"
import { getDashboardData } from "~/features/dashboard/api/getDashboardData";
import { BookingStatsChart } from "~/features/dashboard/components/booking-stats-chart";
import { PopularServicesChart } from "~/features/dashboard/components/popular-services-chart";

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

    const popularServices =
        data?.data.popular_services ?? [];

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Booking Stats Chart */}
                <div className="grid">
                    <BookingStatsChart
                        data={bookingStats}
                        range={range}
                        onRangeChange={setRange}
                        isLoading={isLoading}
                    />
                </div>

                {/* Popular Services Chart */}
                <div className="grid">
                    <PopularServicesChart
                        data={popularServices}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}