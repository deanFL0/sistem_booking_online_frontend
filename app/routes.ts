import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),

    // Public Routes
    ...prefix("services", [
        index("routes/services/index.tsx"),
        ...prefix(":serviceId/", [
            route("book", "routes/services/booking/create.tsx"),
        ])
    ]),

    //-------------------------------------------

    // Admin Routes
    // Admin Dashboard
    route("admin/dashboard", "routes/admin/admin-dashboard.tsx"),

    // Service Routes
    ...prefix("admin/services", [
        index("routes/admin/services/index.tsx"),
        route("create", "routes/admin/services/create.tsx"),
        route(":serviceId", "routes/admin/services/show.tsx"),
        route(":serviceId/edit", "routes/admin/services/edit.tsx"),
        // Service Resource Types Routes
        ...prefix(":serviceId/resource-types", [
            route("create", "routes/admin/services/resource-types/create.tsx"),
        ]),
    ]),

    // Resource Type Routes
    ...prefix("admin/resource-types", [
        index("routes/admin/resource-types/index.tsx"),
        route("create", "routes/admin/resource-types/create.tsx"),
        route(":resourceTypeId", "routes/admin/resource-types/show.tsx"),
        route(":resourceTypeId/edit", "routes/admin/resource-types/edit.tsx"),
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
        // Resource Availability Overrides
        ...prefix(":resourceId/availability-overrides", [
            route("create", "routes/admin/resources/res-avail-overrides/create.tsx"),
            route(":overrideId/edit", "routes/admin/resources/res-avail-overrides/edit.tsx"),
        ]),
    ]),

    // User Routes
    ...prefix("admin/users", [
        index("routes/admin/users/index.tsx"),
        route("create", "routes/admin/users/create.tsx"),
        route(":userId", "routes/admin/users/show.tsx"),
        route(":userId/edit", "routes/admin/users/edit.tsx"),
    ]),

    // Booking Routes
    ...prefix("admin/bookings", [
        index("routes/admin/bookings/index.tsx"),
        route("create", "routes/admin/bookings/create.tsx"),
        route(":bookingId", "routes/admin/bookings/show.tsx"),
        route(":bookingId/edit", "routes/admin/bookings/edit.tsx"),
    ]),
] satisfies RouteConfig;