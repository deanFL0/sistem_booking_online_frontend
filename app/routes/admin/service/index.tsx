import { AdminLayout } from "~/components/admin/admin-layout";
import { ServiceTable } from "~/features/service/components/service-table";

export default function AdminServicesPage() {
    return (
        <AdminLayout>
            <h1>Daftar Layanan</h1>
            <ServiceTable />
        </AdminLayout>
    );
}