import { Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Link } from "react-router";

import { Container } from "../container";

const navItems = [
    {
        label: "Layanan",
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
                        <Button size={"lg"} render={<Link to={"/auth/login"} />}>
                            Masuk
                        </Button>
                        <Button size={"lg"} variant={"outline"} render={<Link to={"/auth/register"} />}>
                            Daftar
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