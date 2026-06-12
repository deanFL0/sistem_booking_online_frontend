import type { ReactNode } from "react";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import {
    SidebarProvider,
    SidebarInset,
} from "~/components/ui/sidebar";

import { getToken, getUser } from "~/lib/auth";
import { Navigate } from "react-router";
import { TooltipProvider } from "../ui/tooltip";
import { AuthNavbar } from "./navbars/auth-navbar";
import { AdminNavbar } from "./navbars/admin-navbar";

export function AdminLayout({
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
                <AdminNavbar />
                <main className="min-h-screen bg-background text-freground px-4 py-4">
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}