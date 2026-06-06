import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs";

import type { BookingStatsItem } from "../api/geBookingStats";
import { getNiceMax } from "../helper/get-nice-max";

interface BookingStatsChartProps {
    data: BookingStatsItem[];
    range: "week" | "month" | "year";
    onRangeChange: (
        range: "week" | "month" | "year"
    ) => void;
}

export function BookingStatsChart({
    data,
    range,
    onRangeChange,
}: BookingStatsChartProps) {

    const maxValue = Math.max(
        ...data.map((item) =>
            item.pending +
            item.confirmed +
            item.completed +
            item.cancelled +
            item.no_show
        )
    )

    const yAxisMax = getNiceMax(maxValue);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle>
                        Booking Overview
                    </CardTitle>

                    <CardDescription>
                        Booking activity trends and cancellations
                    </CardDescription>
                </div>

                <Tabs
                    value={range}
                    onValueChange={(value) =>
                        onRangeChange(
                            value as "week" | "month" | "year"
                        )
                    }
                >
                    <TabsList>
                        <TabsTrigger value="week">
                            Week
                        </TabsTrigger>

                        <TabsTrigger value="month">
                            Month
                        </TabsTrigger>

                        <TabsTrigger value="year">
                            Year
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>

            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart data={data ?? []}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                domain={[0, yAxisMax]}
                            />

                            <Tooltip />

                            <Bar
                                dataKey="pending"
                                stackId="a"
                                fill="#f59e0b"
                                barSize={40}
                                radius={[0, 0, 4, 4]}
                            />

                            <Bar
                                dataKey="confirmed"
                                stackId="a"
                                fill="#2563eb"
                                barSize={40}
                                radius={[0, 0, 4, 4]}
                            />

                            <Bar
                                dataKey="completed"
                                stackId="a"
                                fill="#32a852"
                                barSize={40}
                                radius={[0, 0, 4, 4]}
                            />

                            <Bar
                                dataKey="cancelled"
                                stackId="a"
                                fill="#dc2626"
                                barSize={40}
                            />

                            <Bar
                                dataKey="no_show"
                                stackId="a"
                                fill="#6b7280"
                                barSize={40}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>

        </Card>
    );
}