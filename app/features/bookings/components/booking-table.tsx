import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { useDebouncedValue } from "~/hooks/use-debounce"
import { toast } from "sonner"
import { bookingApi } from "../api/booking-api"
import type { Booking } from "../type/booking"

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: "booking_code",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Kode Booking" />
        ),
        meta: {
            filterVariant: "text",
            filterLabel: "Kode Booking",
        },
    },
    {
        accessorKey: "service.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Layanan" />
        ),
    },
    {
        accessorKey: "customer_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Pelanggan" />
        ),
        meta: {
            sortable: true,
            filterVariant: "text",
            filterLabel: "Nama Pelanggan",
        },
    },
    {
        accessorKey: "customer_email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email Pelanggan" />
        ),
        meta: {
            sortable: true,
            filterVariant: "text",
            filterLabel: "Email Pelanggan",
        },
    },
    {
        accessorKey: "start_datetime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal & Jam" />
        ),
        cell: ({ row }) => {
            const startDatetime = row.getValue("start_datetime") as string;

            return (
                <div className="flex flex-col">
                    <span>{new Date(startDatetime).toLocaleDateString("id-ID")}</span>
                    <span className="text-sm text-muted-foreground">
                        {new Date(startDatetime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            );
        },
        meta: {
            sortable: true,
            filterVariant: "date-range",
            filterLabel: "Tanggal mulai",
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${(row.original.status === "pending")
                    ? "bg-green-100 text-green-800"
                    : row.original.status === "confirmed"
                        ? "bg-yellow-100 text-yellow-800"
                        : row.original.status === "ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : row.original.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : row.original.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : row.original.status === "no_show"
                                        ? "bg-gray-100 text-gray-800"
                                        : ""
                    }`}
            >
                {row.original.status}
            </span>
        ),
        meta: {
            sortable: true,
            filterVariant: "multi-choice",
            filterLabel: "Status",
            filterOptions: [
                { label: "Pending", value: "pending" },
                { label: "Confirmed", value: "confirmed" },
                { label: "Ongoing", value: "ongoing" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
                { label: "No Show", value: "no_show" },
            ],
        },
    }
]

export function BookingTable() {
    const [
        pagination,
        setPagination,
    ] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [
        sorting,
        setSorting,
    ] = useState<SortingState>([])

    const [
        filters,
        setFilters,
    ] = useState<Record<string, unknown>>({})

    const debouncedFilters = useDebouncedValue(filters, 500)

    const queryParams = useMemo(
        () => ({
            pagination,
            sorting,
            filters: debouncedFilters,
            includes: ["service"],
        }),
        [pagination, sorting, debouncedFilters]
    )

    const query = useQuery({
        queryKey: ["bookings", queryParams],

        queryFn: () => bookingApi.getAll(queryParams),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })

    const handleDelete = async (booking: any) => {
        try {
            await bookingApi.delete(booking.id);
            // Refresh data after successful deletion
            await query.refetch();
            toast.success("Booking deleted successfully");
        } catch (error) {
            toast.error("Failed to delete booking");
            throw error; // Re-throw to handle in dialog
        }
    };

    return (
        <DataTable
            columns={columns}
            data={query.data?.data ?? []}
            pageCount={query.data?.meta?.last_page ?? 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            filters={filters}
            onFiltersChange={setFilters}
            showNumberColumn={true}
            isLoading={query.isLoading}
            isFetching={query.isFetching}
            actions={{
                viewLink: (booking: Booking) => `/admin/bookings/${booking.id}`,
                editLink: (booking: Booking) => `/admin/bookings/${booking.id}/edit`,
                onDelete: (booking: Booking) => handleDelete(booking),
                deleteConfirmationMessage: (booking: Booking) => `Apakah Anda yakin ingin menghapus booking "${booking.booking_code}"?`,
            }}
            getRowClassName={(booking) => {
                if (booking.has_conflict) {
                    return "border-l-4 bg-yellow-50/50 shadow-[inset_4px_0_0_0_rgb(239_68_68)]";
                }

                return "";
            }}
        />
    )
}