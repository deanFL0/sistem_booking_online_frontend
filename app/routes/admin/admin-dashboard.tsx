import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { AdminLayout } from "~/components/layout/admin-layout";
import { getDashboardData } from "~/features/dashboard/api/getDashboardData";
import { BookingStatsChart } from "~/features/dashboard/components/booking-stats-chart";
import { ConflictedBookingsTable } from "~/features/dashboard/components/conflicted-bookings-table";
import { PopularServicesChart } from "~/features/dashboard/components/popular-services-chart";
import { ResourceOverrideTable } from "~/features/dashboard/components/resource-override-table";

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

    const resourceOverrides =
        data?.data.resource_availability_overrides ?? [];

    const conflictedBookings =
        data?.data.conflicted_bookings ?? [];

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-6">

                    {/* Booking Stats Chart */}
                    <div className="col-span-2">
                        <BookingStatsChart
                            data={bookingStats}
                            range={range}
                            onRangeChange={setRange}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="col-span-1">
                        <PopularServicesChart
                            data={popularServices}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Popular Services Chart */}
                <div className="grid grid-cols-2 gap-6">
                    <ResourceOverrideTable
                        data={resourceOverrides}
                    />
                    <ConflictedBookingsTable
                        data={conflictedBookings}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}