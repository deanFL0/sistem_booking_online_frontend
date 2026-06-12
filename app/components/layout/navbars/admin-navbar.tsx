import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Bell, User } from "lucide-react";

import { Container } from "../container";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";
import { authApi } from "~/features/auth/api/auth-api";
import { UserMenu } from "./user-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { SidebarTrigger } from "~/components/ui/sidebar";

const navItems = [
    {
        label: "Beranda",
        href: "/",
    },
    {
        label: "Layanan",
        href: "/services",
    },
    {
        label: "Dashboard",
        href: "/admin/dashboard",
    },
];

const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/";
}

export function AdminNavbar() {
    return (
        <header className="sticky top-0 z-50 flex h-16 items-center border-b px-4 bg-background/80 backdrop-blur">
            <Container className="flex items-center justify-between">
                <div className="flex items-center gap-4 ml-[-16px]">
                    <SidebarTrigger
                        render={
                            <Button size={"icon-lg"} className="rounded-full bg-transparent size-8 hover:cursor-pointer">
                                <Menu className="size-5" color="black" />
                            </Button>
                        }
                    />
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-primary" />
                        <span className="font-bold text-lg">
                            Joe's Barber
                        </span>
                    </div>
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-lg font-medium transition-colors hover:text-primary"
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className="flex gap-2">
                        <Button size={"icon-lg"}>
                            <Bell className="size-5" />
                        </Button>
                        <UserMenu />
                    </div>
                </nav>

                {/* Mobile nav */}
                <Sheet>
                    <SheetTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <Menu className="size-5" />
                            </Button>
                        }
                    />

                    <SheetContent side="right" className="w-80 flex flex-col">
                        <div className="mt-8 flex-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="
                                        flex items-center justify-between
                                        rounded-lg px-4 py-4
                                        text-base font-medium
                                        transition-colors
                                        hover:bg-accent
                                        active:bg-accent
                                        active:scale-[0.98]
                                    "
                                >
                                    <span>{item.label}</span>
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </a>
                            ))}

                            <Separator className="my-4" />

                            <Link
                                to={"notifications"}
                                className="
                                    flex items-center gap-3
                                    rounded-lg px-4 py-4
                                    text-base font-medium
                                    hover:bg-accent
                                    active:bg-accent
                                "
                            >
                                <Bell className="size-5" />
                                <span>Pemberitahuan</span>
                            </Link>

                            <Collapsible>
                                <CollapsibleTrigger className="w-full group">
                                    <div
                                        className="
                                            flex items-center justify-between
                                            rounded-lg px-4 py-4
                                            text-base font-medium
                                            transition-colors
                                            hover:bg-accent
                                            active:bg-accent
                                        "
                                    >
                                        <div className="flex items-center gap-3">
                                            <User className="size-5" />
                                            <span>Akun Saya</span>
                                        </div>

                                        <ChevronLeft className="
                                            size-4 text-muted-foreground 
                                            transition-transform duration-200 
                                            group-data-open:-rotate-90 group-data-[panel-open]:-rotate-90 
                                            group-data-[state=open]:-rotate-90
                                        "
                                        />
                                    </div>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="space-y-1 pt-1">
                                    <Link
                                        to="/profile/bio"
                                        className="
                                            ml-4 flex items-center
                                            rounded-lg px-4 py-3
                                            text-sm 
                                            transition-colors
                                            hover:bg-accent
                                            hover:text-foreground
                                            active:bg-accent
                                        "
                                    >
                                        Profil
                                    </Link>

                                    <Link
                                        to="/my-bookings"
                                        className="
                                            ml-4 flex items-center
                                            rounded-lg px-4 py-3
                                            text-sm 
                                            transition-colors
                                            hover:bg-accent
                                            hover:text-foreground
                                            active:bg-accent
                                        "
                                    >
                                        Booking Saya
                                    </Link>

                                    <Link
                                        to="/profile/preferences"
                                        className="
                                            ml-4 flex items-center
                                            rounded-lg px-4 py-3
                                            text-sm 
                                            transition-colors
                                            hover:bg-accent
                                            hover:text-foreground
                                            active:bg-accent
                                        "
                                    >
                                        Pengaturan
                                    </Link>
                                </CollapsibleContent>
                            </Collapsible>

                        </div>

                        <div>
                            <Separator />
                            <div className="w-full px-4 py-4">
                                <Button
                                    className="w-full bg-red-600 text-black active:bg-red-800"
                                    onClick={() => handleLogout()}
                                >
                                    <LogOut className="size-4 mr-2" />
                                    Keluar
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </Container>
        </header>
    )
}