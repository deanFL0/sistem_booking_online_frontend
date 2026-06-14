import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { BookingTable } from "~/features/bookings/components/booking-table";

export default function AdminBookingsPage() {
    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Daftar Booking"
                    description=" kelola daftar pengguna yang tersedia"
                    actions={
                        <Button>
                            <Link to={"/admin/bookings/create"} className="flex items-center gap-2">
                                <Plus />
                                Tambah Booking
                            </Link>
                        </Button>
                    }
                />
                <BookingTable />
            </AdminPage>
        </AdminLayout>
    );
}