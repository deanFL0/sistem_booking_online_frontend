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

const sidebarItem = [
    {
        group: "Umum",
        items: [
            {
                label: "Dashboard",
                href: "/admin/dashboard",
                icon: Gauge,
            },
            {
                label: "Booking",
                href: "/admin/bookings",
                icon: Book,
            },
        ]
    },
    {
        group: "Sumber daya",
        items: [
            {
                label: "Sumber Daya",
                href: "/admin/resources",
                icon: Package,
            },
            {
                label: "Tipe Sumber Daya",
                href: "/admin/resources-types",
                icon: StickyNotes,
            },
        ]
    },
    {
        group: "Layanan",
        items: [
            {
                label: "Layanan",
                href: "/admin/services",
                icon: HandPlatter,
            },
        ]
    },
    {
        group: "User",
        items: [
            {
                label: "User",
                href: "/admin/users",
                icon: Users,
            },
        ]
    }
]

function isActivePath(pathname: string, href: string) {
    return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
    );
}

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
                {sidebarItem.map((group) => (
                    <SidebarGroup key={group.group}>
                        <SidebarGroupLabel>
                            {group.group}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        render={<Link to={item.href} />}
                                        isActive={isActivePath(window.location.pathname, item.href)}
                                    >
                                        <item.icon className="size-5" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
            </SidebarFooter>
        </Sidebar>
    );
}