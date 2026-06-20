import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { UserTable } from "~/features/users/components/user-table";

export default function AdminUsersPage() {
    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Daftar Pengguna"
                    description=" kelola daftar pengguna yang tersedia"
                    actions={
                        <Button>
                            <Link to={"/admin/users/create"} className="flex items-center gap-2">
                                <Plus />
                                Tambah User
                            </Link>
                        </Button>
                    }
                />
                <UserTable />
            </AdminPage>
        </AdminLayout>
    );
}