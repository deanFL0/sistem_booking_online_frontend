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
    useSidebar,
} from "~/components/ui/sidebar";

import { Link } from "react-router";
import { Book, Gauge, HandPlatter, Package, StickyNotes, Users } from "lucide-react";
import { getUser } from "~/lib/auth";

const user = getUser();

export function AdminSidebar() {
    const { state } = useSidebar();

    const collapsed = state === "collapsed";

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex h-16 items-center justify-center border-b px-4 bg-sidebar-primary">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-secondary size-8 flex items-center justify-center">
                        <span className="font-bold text-secondary-foreground">{user?.name.substring(0, 1).toUpperCase()}</span>
                    </div>
                    {!collapsed && (
                        <span className="text-xl font-semibold text-primary-foreground">
                            {user?.name}
                        </span>
                    )}
                </div>
            </SidebarHeader>
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
            </SidebarFooter>
        </Sidebar>
    );
}