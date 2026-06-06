import { api } from "~/lib/axios";

export type BookingStatsItem = {
    date: string;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    no_show: number;
};

export type BookingStatsResponse = {
    range: "week" | "month" | "year";
    data: BookingStatsItem[];
};

export async function getBookingStats(
    range: "week" | "month" | "year" = "month"
) {
    const response = await api.get<BookingStatsResponse>(
        "/bookings/stats",
        {
            params: {
                range,
            },
        }
    );

    return response.data;
}