import { useQuery } from "@tanstack/react-query";
import { useState } from "react"
import { AdminLayout } from "~/components/admin/admin-layout"
import { getBookingStats } from "~/features/dashboard/api/geBookingStats";
import { BookingStatsChart } from "~/features/dashboard/components/booking-stats-chart";

export default function AdminDashboard() {
    const [range, setRange] = useState<"week" | "month" | "year">("month");

    const { data, isLoading } = useQuery({
        queryKey: ["booking-overview", range],
        queryFn: () => getBookingStats(range)
    })
    console.log(data)
    return (
        <AdminLayout>
            <BookingStatsChart
                data={data?.data ?? []}
                range={range}
                onRangeChange={setRange}
            />
        </AdminLayout>
    )
}