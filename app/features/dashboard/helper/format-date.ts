import { parseISO, format } from "date-fns";

import type { BookingStatsItem } from "../api/getDashboardData";

export default function formatDate(
    data: BookingStatsItem[],
    range: "week" | "month" | "year"
) {
    const formattedData = data.map((item) => {
        const date = parseISO(item.date);

        return {
            ...item,
            label:
                range === "week"
                    ? format(date, "EEE")
                    : range === "month"
                        ? format(date, "d")
                        : format(date, "MMM"),
        };
    });
    return formattedData;
}