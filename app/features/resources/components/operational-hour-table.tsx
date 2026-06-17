import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { OperationalHour } from "../types/operational-hours";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { DataTable } from "~/components/data-table/data-table";
import { useQueryClient } from "@tanstack/react-query";
import { operationalHourApi } from "../api/operational-hours-api";
import { toast } from "sonner";

export const columns: ColumnDef<OperationalHour>[] = [
    {
        accessorKey: "day_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Hari" />
        ),
    },
    {
        accessorKey: "open_time",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jam Buka" />
        ),
    },
    {
        accessorKey: "close_time",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jam Tutup" />
        ),
    },
    {
        accessorKey: "is_closed",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${row.original.is_closed
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                    }`}
            >
                {row.original.is_closed ? "Tutup" : "Buka"}
            </span>
        ),
    },
]

export function OperationalHourTable({ resourceId, operationalHours }: { resourceId: string, operationalHours: OperationalHour[] }) {
    const queryClient = useQueryClient();

    const handleDelete = async (operational_hour: OperationalHour) => {
        try {
            await operationalHourApi.delete(resourceId, String(operational_hour.id));
            // Refresh data after successful deletion
            await queryClient.invalidateQueries({
                queryKey: ["resource", resourceId],
            })
            toast.success("Jam operasional berhasil dihapus");
        } catch (error) {
            toast.error("Gagal menghapus jam operasional");
            throw error; // Re-throw to handle in dialog
        }
    }

    return (
        <DataTable
            columns={columns}
            data={operationalHours}
            showNumberColumn={false}
            isLoading={false}
            isFetching={false}
            actions={{
                editLink: (operational_hour: OperationalHour) => `/admin/operational_hours/${operational_hour.id}/edit`,
                onDelete: (operational_hour: OperationalHour) => handleDelete(operational_hour),
                deleteConfirmationMessage: (operational_hour: OperationalHour) => `Apakah Anda yakin ingin menghapus jam operasional pada hari "${operational_hour.day_name}"?`,
            }}
        />
    )
}