import dayjs from "dayjs";
import { Badge } from "lucide-react";
import { DashboardTable } from "./dashboard-table";
import { getDashboardData } from "../api/getDashboardData";
import type { ResourceAvailabilityOverrideItem } from "../types/dashboard";

export const columns = [
    {
        key: "resource_name",
        header: "Sumber Daya"
    },
    {
        key: "status",
        header: "Ketersediaan",
        render: (row: ResourceAvailabilityOverrideItem) => (
            row.status === "available" ? "Tersedia" : "Tidak Tersedia"
        )
    },
    {
        key: "is_ongoing",
        header: "Status",
        render: (row: ResourceAvailabilityOverrideItem) => (
            row.is_ongoing ? "Sedang Berlangsung" : "Akan Datang"
        )
    },
    {
        key: "display_time",
        header: "Waktu",
    },
    {
        key: "reason",
        header: "Alasan"
    },
];

interface ResourceOverrideTableProps {
    data: ResourceAvailabilityOverrideItem[]
}

export function ResourceOverrideTable({ data }: ResourceOverrideTableProps) {
    return (
        <DashboardTable
            title="Penggantian Ketersediaan Sumber Daya"
            description="Penggantian ketersediaan sumber daya yang sedang berlansung dan yang akan datang."
            columns={columns}
            data={data}
        />
    )
}