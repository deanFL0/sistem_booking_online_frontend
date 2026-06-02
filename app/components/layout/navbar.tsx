import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link } from "react-router";

import { Container } from "./container";

const navItems = [
    {
        label: "Jasa",
        href: "/services",
    },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <Container className="flex h-16 items-center justify-between">
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
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.label}
                        </a>
                    ))}
                    <div className="flex gap-2">
                        <Button size={"lg"} asChild>
                            <Link to={"/auth/login"}>
                                Masuk
                            </Link>
                        </Button>
                        <Button size={"lg"} variant={"outline"} asChild>
                            <Link to={"/auth/register"}>
                                Daftar
                            </Link>
                        </Button>
                    </div>
                </nav>

                {/* Mobile Nav */}
                {/* <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="size-5" />
                        </Button>
                    </SheetTrigger>

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

                            <div>
                                <Button size={"lg"}>
                                    Masuk
                                </Button>
                                <Button size={"lg"} variant={"outline"}>
                                    Daftar
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet> */}
            </Container>
        </header>
    )
}