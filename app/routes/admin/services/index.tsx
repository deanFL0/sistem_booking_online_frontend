import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { ServiceTable } from "~/features/service/components/service-table";

export default function AdminServicesPage() {
    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Daftar Layanan"
                    description=" kelola daftar layanan yang tersedia"
                    actions={
                        <Button>
                            <Link to={"/admin/services/create"} className="flex items-center gap-2">
                                <Plus />
                                Tambah Layanan
                            </Link>
                        </Button>
                    }
                />
                <ServiceTable />
            </AdminPage>
        </AdminLayout>
    );
}