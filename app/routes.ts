import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),

    // Admin Layout/Dashboard
    route("admin/dashboard", "routes/admin/admin-dashboard.tsx"),

    // Nested Service Routes
    ...prefix("admin/services", [
        index("routes/admin/services/index.tsx"),
        route("create", "routes/admin/services/create.tsx"),
        route(":id", "routes/admin/services/show.tsx"),
    ]),
] satisfies RouteConfig;