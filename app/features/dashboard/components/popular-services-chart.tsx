"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import type { PopularServiceItem } from "../types/dashboard";

interface PopularServicesChartProps {
    data: PopularServiceItem[];
    isLoading?: boolean;
}

const gradients = [
    ["#3b82f6", "#60a5fa"],
    ["#8b5cf6", "#a78bfa"],
    ["#10b981", "#34d399"],
    ["#f59e0b", "#fbbf24"],
    ["#ef4444", "#f87171"],
];

export function PopularServicesChart({
    data,
    isLoading,
}: PopularServicesChartProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        Layanan Terpopuler
                    </CardTitle>

                    <CardDescription>
                        Memuat data layanan...
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="h-[350px] flex items-center justify-center">
                        Loading...
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Top 5 Layanan Terpopuler
                </CardTitle>

                <CardDescription>
                    Berdasarkan booking yang telah selesai dalam
                    30 hari terakhir
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{
                                top: 5,
                                right: 20,
                                left: 20,
                                bottom: 5,
                            }}
                        >

                            <defs>
                                {gradients.map((gradient, index) => (
                                    <linearGradient
                                        key={index}
                                        id={`gradient-${index}`}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="0"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={gradient[0]}
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor={gradient[1]}
                                        />
                                    </linearGradient>
                                ))}
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                            />

                            <XAxis
                                type="number"
                                allowDecimals={false}
                            />

                            <YAxis
                                type="category"
                                dataKey="service_name"
                                width={140}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `${value} booking`,
                                    "Total",
                                ]}
                            />

                            <Bar
                                dataKey="total_bookings"
                                radius={[0, 6, 6, 0]}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={`url(#gradient-${index})`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}