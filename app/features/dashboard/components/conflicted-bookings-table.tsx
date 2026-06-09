import { DashboardTable } from "./dashboard-table";
import type { ConflictedBookingsItem } from "../types/dashboard";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

const columns = [
    {
        key: "booking_code",
        header: "Kode Booking",
    },
    {
        key: "customer_name",
        header: "Pelanggan",
    },
    {
        key: "start_datetime",
        header: "Waktu Mulai",
    },
    {
        header: "Aksi",
        render: (row: ConflictedBookingsItem) => {
            return (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        render={<Link to={`/admin/bookings/${row.id}/review`}>
                            Review
                        </Link>}
                    />
                </div>
            );
        },
    }
]

export function ConflictedBookingsTable({ data }: { data: ConflictedBookingsItem[] }) {
    return (
        <DashboardTable
            title="Konflik Pemesanan"
            description="Daftar pemesanan terkonfirmasi yang memiliki konflik."
            columns={columns}
            data={data}
        />
    );
}