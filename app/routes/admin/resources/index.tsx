import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { ResourceTable } from "~/features/resources/components/resource-table";

export default function AdminResourcesPage() {
    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Daftar Sumber Daya"
                    description=" kelola daftar sumber daya yang tersedia"
                    actions={
                        <Button>
                            <Link to={"/admin/resources/create"} className="flex items-center gap-2">
                                <Plus />
                                Tambah Sumber Daya
                            </Link>
                        </Button>
                    }
                />
                <ResourceTable />
            </AdminPage>
        </AdminLayout>
    );
}