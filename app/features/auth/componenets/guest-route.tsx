import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getToken, getUser } from "~/lib/auth";

interface GuestRouteProps {
    children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        const user = getUser()

        if (token && user) {
            if (user?.role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/services", { replace: true });
            }
        }
    }, [navigate]);

    return <>{children}</>;
}
