import { CalendarCheck, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authApi } from "~/features/auth/api/auth-api";
import { getUser } from "~/lib/auth";

const user = getUser()

const handleLogout = async () => {
    await authApi.logout();
    window.location.href = "/";
}

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        size="icon-lg"
                        className="rounded-full"
                    >
                        <User className="size-5" />
                    </Button>
                }
            />

            <DropdownMenuContent
                align="end"
                className="w-56"
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        {user?.name || "User"}
                    </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    render={
                        <Link to="/profile/bio">
                            <User className="size-4 mr-2" />
                            Profil
                        </Link>
                    }
                >
                </DropdownMenuItem>

                <DropdownMenuItem
                    render={
                        <Link to="/my-bookings">
                            <CalendarCheck className="size-4 mr-2" />
                            Booking Saya
                        </Link>
                    }
                >
                </DropdownMenuItem>

                <DropdownMenuItem
                    render={
                        <Link to="/profile/preferences">
                            <Settings className="size-4 mr-2" />
                            Pengaturan
                        </Link>
                    }
                >
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="size-4 mr-2" />
                    Keluar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}