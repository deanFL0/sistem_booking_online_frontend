"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import { getNiceMax } from "../helper/get-nice-max";
import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

interface BookingStatsItem {
    date: string;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    no_show: number;
}

interface BookingStatsChartProps {
    data: BookingStatsItem[];
    range: "week" | "month" | "year";
    onRangeChange: (range: "week" | "month" | "year") => void;
    isLoading?: boolean;
}

export function BookingStatsChart({
    data,
    range,
    onRangeChange,
    isLoading,
}: BookingStatsChartProps) {
    // Format date label
    const formattedData = data.map((item) => {
        const date = parseISO(item.date);

        return {
            ...item,
            label:
                range === "week"
                    ? format(date, "EEE", { locale: id })
                    : range === "month"
                        ? format(date, "d", { locale: id })
                        : format(date, "MMM", { locale: id }),
        };
    });

    // Calculate max value for Y axis
    const maxValue = Math.max(
        0,
        ...data.map(
            (item) =>
                item.pending +
                item.confirmed +
                item.completed +
                item.cancelled +
                item.no_show
        )
    );

    const yAxisMax = maxValue > 0 ? getNiceMax(maxValue) : 10;

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Overview</CardTitle>
                    <CardDescription>
                        Memuat data booking...
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="h-[350px] flex items-center justify-center">
                        Memuat...
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Statistik Booking</CardTitle>

                    <CardDescription>
                        Statistik booking berdasarkan {range}
                    </CardDescription>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onRangeChange("week")}
                        className={`px-3 py-1 rounded border ${range === "week"
                            ? "bg-black text-white"
                            : ""
                            }`}
                    >
                        Minggu ini
                    </button>

                    <button
                        onClick={() => onRangeChange("month")}
                        className={`px-3 py-1 rounded border ${range === "month"
                            ? "bg-black text-white"
                            : ""
                            }`}
                    >
                        Bulan ini
                    </button>

                    <button
                        onClick={() => onRangeChange("year")}
                        className={`px-3 py-1 rounded border ${range === "year"
                            ? "bg-black text-white"
                            : ""
                            }`}
                    >
                        Tahun ini
                    </button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="label" />

                            <YAxis domain={[0, yAxisMax]} />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="pending"
                                stackId="a"
                                fill="#facc15"
                            />

                            <Bar
                                dataKey="confirmed"
                                stackId="a"
                                fill="#3b82f6"
                            />

                            <Bar
                                dataKey="completed"
                                stackId="a"
                                fill="#22c55e"
                            />

                            <Bar
                                dataKey="cancelled"
                                stackId="a"
                                fill="#ef4444"
                            />

                            <Bar
                                dataKey="no_show"
                                stackId="a"
                                fill="#6b7280"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}