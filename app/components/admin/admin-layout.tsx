import type { ReactNode } from "react";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import {
    SidebarProvider,
    SidebarInset,
} from "~/components/ui/sidebar";

import { AuthNavbar } from "~/components/layout/navbars/auth-navbar";
import { getToken, getUser } from "~/lib/auth";
import { Navigate } from "react-router";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const token = getToken();
    const user = getUser();
    // check if user is not logged in
    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }
    // check if user is admin
    if (user.role !== "admin") {
        return <Navigate to="/" replace />
    }

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