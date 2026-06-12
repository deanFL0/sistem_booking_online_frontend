import { ChevronRight, Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

import { Container } from "../container";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";

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

export function Navbar() {
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
                        <Button
                            render={
                                <Link to={"/auth/login"}>
                                    Masuk
                                </Link>
                            }
                        />
                        <Button
                            variant={"outline"}
                            render={
                                <Link to={"/auth/register"}>
                                    Daftar
                                </Link>
                            }
                        />

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

                            <div className="pl-4 pr-4 space-y-2">
                                <div>
                                    <Button
                                        className={"w-full"}
                                        render={
                                            <Link to={"/auth/login"}>
                                                Masuk
                                            </Link>
                                        }
                                    />
                                </div>
                                <div>
                                    <Button
                                        className={"w-full"}
                                        variant={"outline"}
                                        render={
                                            <Link to={"/auth/register"}>
                                                Daftar
                                            </Link>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </Container>
        </header>
    )
}