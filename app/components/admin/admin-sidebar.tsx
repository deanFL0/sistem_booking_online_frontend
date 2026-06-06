import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar";

import { Link } from "react-router";
import { Book, Gauge, HandPlatter, Package, StickyNote, StickyNotes, Users } from "lucide-react";
import { AdminSidebarHeader } from "./admin-sisebar-header";

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon">
            <AdminSidebarHeader />

            <SidebarContent>

                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                render={<Link to="/admin/dashboard" />}
                            >
                                <Gauge className="size-5" />
                                <span>Dashboard</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                render={<Link to="/admin/bookings" />}
                            >
                                <Book className="size-5" />
                                <span>Booking</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Sumber daya
                    </SidebarGroupLabel>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                render={<Link to="/admin/resources" />}
                            >
                                <Package className="size-5" />
                                <span>Sumber Daya</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                render={<Link to="/admin/resources-types" />}
                            >
                                <StickyNotes className="size-5" />
                                <span>Tipe Sumber Daya</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Layanan
                    </SidebarGroupLabel>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link to="/admin/services" />}>
                                <div className="flex gap-2">
                                    <HandPlatter className="size-5" />
                                    Layanan
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        User
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton render={<Link to="/admin/users" />}>
                                <div className="flex gap-2">
                                    <Users className="size-5" />
                                    User
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter className="border-t p-4">
                Admin
            </SidebarFooter>
        </Sidebar>
    );
}