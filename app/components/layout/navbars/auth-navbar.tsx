import { ChevronRight, LogOut, Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Bell, User } from "lucide-react";

import { Container } from "../container";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";
import { authApi } from "~/features/auth/api/auth-api";

const navItems = [
    {
        label: "Beranda",
        href: "/",
    },
    {
        label: "Layanan",
        href: "/services",
    },
];

const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/";
}

export function AuthNavbar() {
    return (
        <header className="sticky top-0 z-50 flex h-16 items-center border-b px-4 bg-background/80 backdrop-blur">
            <Container className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-primary" />
                    <span className="font-bold text-lg">
                        Joe's Barber
                    </span>
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
                        <Button size={"icon-lg"} className={"rounded-full bg-primary"}>
                            <User className="size-5" />
                        </Button>
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

                    <SheetContent side="right" className="w-80">
                        <div className="mt-8 flex flex-col">
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
                                    hover:bg-accent
                                    active:bg-accent
                                "
                            >
                                <Bell className="size-5" />
                                <span>Notifications</span>
                            </Link>

                            <Link
                                to={"profile"}
                                className="
                                    flex items-center gap-3
                                    rounded-lg px-4 py-4
                                    hover:bg-accent
                                    active:bg-accent
                                "
                            >
                                <User className="size-5" />
                                <span>Profile</span>
                            </Link>

                            {/* put logout on bottom */}
                            <div className="absolute bottom-4 right-0 left-0">
                                <Separator className="my-4" />
                                <div className="w-full pr-4 pl-4">
                                    <Button
                                        className="w-full bg-red-600 text-black active:bg-red-800"
                                        onClick={() => handleLogout()}
                                    >
                                        <LogOut className="size-4 mr-2" />
                                        Keluar
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </Container>
        </header>
    )
}