import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { ServiceTable } from "~/features/services/components/service-table";
import { ResourceTypesTable } from "~/features/resource-types/components/resource-types-table";

export default function AdminResourceTypesPage() {
    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Daftar Tipe Sumber Daya"
                    description=" kelola daftar tipe sumber daya yang tersedia"
                    actions={
                        <Button>
                            <Link to={"/admin/resource-types/create"} className="flex items-center gap-2">
                                <Plus />
                                Tambah Tipe Sumber Daya
                            </Link>
                        </Button>
                    }
                />
                <ResourceTypesTable />
            </AdminPage>
        </AdminLayout>
    );
}