import { Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Link } from "react-router";
import { Bell, User } from "lucide-react";

import { Container } from "../container";

const navItems = [
    {
    },
];

export function AuthNavbar() {
    return (
        <header className="sticky top-0 z-50 flex h-16 items-center border-b px-4 bg-background/80 backdrop-blur">
            <Container className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    Dashboard
                </div>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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

                    <SheetContent side="right">
                        <div className="mt-8 flex flex-col gap-6">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-lg"
                                >
                                    {item.label}
                                </a>
                            ))}

                            <div className="flex flex-col gap-2 mt-4">
                                <Button size={"lg"} render={<Link to={"/auth/login"} />}>
                                    Masuk
                                </Button>
                                <Button size={"lg"} variant={"outline"} render={<Link to={"/auth/register"} />}>
                                    Daftar
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </Container>
        </header>
    )
}