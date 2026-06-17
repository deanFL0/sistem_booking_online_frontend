import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),

    // Admin Layout/Dashboard
    route("admin/dashboard", "routes/admin/admin-dashboard.tsx"),

    // Service Routes
    ...prefix("admin/services", [
        index("routes/admin/services/index.tsx"),
        route("create", "routes/admin/services/create.tsx"),
        route(":id", "routes/admin/services/show.tsx"),
        route(":id/edit", "routes/admin/services/edit.tsx"),
    ]),

    // Resource Type Routes
    ...prefix("admin/resource-types", [
        index("routes/admin/resource-types/index.tsx"),
        route("create", "routes/admin/resource-types/create.tsx"),
        route(":id", "routes/admin/resource-types/show.tsx"),
        route(":id/edit", "routes/admin/resource-types/edit.tsx"),
    ]),

    // Resource Routes
    ...prefix("admin/resources", [
        index("routes/admin/resources/index.tsx"),
        route("create", "routes/admin/resources/create.tsx"),
        route(":resourceId", "routes/admin/resources/show.tsx"),
        route(":id/edit", "routes/admin/resources/edit.tsx"),
        // Operational Hours
        ...prefix(":resourceId/operational-hours", [
            route("create", "routes/admin/resources/operational-hours/create.tsx"),
            route(":operationalHourId/edit", "routes/admin/resources/operational-hours/edit.tsx"),
        ]),
    ]),

    // User Routes
    ...prefix("admin/users", [
        index("routes/admin/users/index.tsx"),
        route("create", "routes/admin/users/create.tsx"),
        route(":id", "routes/admin/users/show.tsx"),
        route(":id/edit", "routes/admin/users/edit.tsx"),
    ]),

    // Booking Routes
    ...prefix("admin/bookings", [
        index("routes/admin/bookings/index.tsx"),
        route("create", "routes/admin/bookings/create.tsx"),
        route(":id", "routes/admin/bookings/show.tsx"),
        route(":id/edit", "routes/admin/bookings/edit.tsx"),
    ]),
] satisfies RouteConfig;