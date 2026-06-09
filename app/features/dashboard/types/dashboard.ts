export type BookingStatsItem = {
    date: string;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    no_show: number;
};

export type BookingStatsByRange = {
    week: BookingStatsItem[];
    month: BookingStatsItem[];
    year: BookingStatsItem[];
};

export type PopularServiceItem = {
    id: string;
    service_name: string;
    booking_count: number;
}

export type ResourceAvailabilityOverrideItem = {
    id: string;
    resource_id: string;
    resource_name: string;
    status: "available" | "unavailable";
    display_time: string;
    is_ongoing: boolean;
    reason?: string;
}

export type ConflictedBookingsItem = {
    id: string;
    booking_code: string;
    customer_name: string;
    start_datetime: string;
}

export type DashboardResponse = {
    data: {
        booking_stats: BookingStatsByRange;
        popular_services: PopularServiceItem[];
        resource_availability_overrides: ResourceAvailabilityOverrideItem[];
        conflicted_bookings: ConflictedBookingsItem[];
    };
};