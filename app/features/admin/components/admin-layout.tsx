import type { ReactNode } from "react";
import { AdminSidebar } from "~/features/admin/components/admin-sidebar";
import {
    SidebarProvider,
    SidebarInset,
} from "~/components/ui/sidebar";

import { AuthNavbar } from "~/components/layout/navbars/auth-navbar";

export function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <SidebarInset>
                <AuthNavbar />
                <main className="p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}