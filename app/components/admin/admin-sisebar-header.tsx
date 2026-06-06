import { Button } from "@base-ui/react";
import { SidebarHeader, SidebarTrigger, useSidebar } from "~/components/ui/sidebar";

export function AdminSidebarHeader() {
    const { state } = useSidebar();

    const collapsed = state === "collapsed";

    return (
        <SidebarHeader className="flex h-16 items-center justify-center border-b px-4 bg-sidebar-primary">
            <div className="flex items-center gap-2">
                <SidebarTrigger
                    render={
                        <Button className="rounded-full bg-primary size-8">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                                className="h-full w-full object-cover"
                            />
                        </Button>
                    }
                />
                {!collapsed && (
                    <span className="text-xl font-semibold text-primary-foreground">
                        Joe's Barber
                    </span>
                )}
            </div>
        </SidebarHeader>
    );
}