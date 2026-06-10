import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),

    //admin routes
    route("admin/dashboard", "routes/admin/admin-dashboard.tsx"),
    route("admin/services", "routes/admin/services/index.tsx"),
] satisfies RouteConfig;
