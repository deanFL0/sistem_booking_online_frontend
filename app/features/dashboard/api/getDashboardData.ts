import { api } from "~/lib/axios";

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

export type DashboardResponse = {
    data: {
        booking_stats: BookingStatsByRange;
    };
};

export async function getDashboardData() {
    const response =
        await api.get<DashboardResponse>(
            "/dashboard"
        );

    return response.data;
}