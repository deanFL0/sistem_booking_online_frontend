import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { useDebouncedValue } from "~/hooks/use-debounce"
import { toast } from "sonner"
import type { ResAvailOverride } from "../types/res-avail-override"
import { resAvailOverrideApi } from "../api/res-avail-override-api"
import { formatDistanceToNowStrict, isPast } from "date-fns"
import { id } from "date-fns/locale";

export const columns: ColumnDef<ResAvailOverride>[] = [
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${row.original.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
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
                { label: "Tersedia", value: "available" },
                { label: "Tidak Tersedia", value: "unavailable" },
            ],
        },
    },
    {
        accessorKey: "start_datetime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Mulai" />
        ),
        cell: ({ row }) => {
            const startDatetime = row.getValue("start_datetime") as string;

            return (
                <div className="flex flex-col">
                    <span>
                        {new Date(startDatetime).toLocaleDateString("id-ID")}
                    </span>

                    <span className="text-sm text-muted-foreground">
                        {new Date(startDatetime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>

                    <span className="text-sm">
                        {isPast(new Date(startDatetime))
                            ? "Ended"
                            : formatDistanceToNowStrict(
                                new Date(startDatetime),
                                { addSuffix: true, locale: id }
                            )}
                    </span>
                </div>
            );
        },
        meta: {
            sortable: true,
            filterVariant: "date-range",
            filterLabel: "Tanggal Mulai",
        },
    },
    {
        accessorKey: "end_datetime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tanggal Berakhir" />
        ),
        cell: ({ row }) => {
            const endDatetime = row.getValue("end_datetime") as string;

            return (
                <div className="flex flex-col">
                    <span>{new Date(endDatetime).toLocaleDateString("id-ID")}</span>
                    <span className="text-sm text-muted-foreground">
                        {new Date(endDatetime).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            );
        },
        meta: {
            sortable: true,
        },
    },
    {
        accessorKey: "reason",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Alasan" />
        ),
    },
]

export function ResAvailOverrideTable(
    { resourceId }: { resourceId: string }
) {
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
        }),
        [pagination, sorting, debouncedFilters]
    )

    const query = useQuery({
        queryKey: ["res-avail-overrides", resourceId, queryParams],

        queryFn: () => resAvailOverrideApi.getAll(resourceId, queryParams),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })

    const handleDelete = async (override: ResAvailOverride) => {
        try {
            await resAvailOverrideApi.delete(resourceId, override.id as string);
            // Refresh data after successful deletion
            await query.refetch();
            toast.success("Override deleted successfully");
        } catch (error) {
            toast.error("Failed to delete override");
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
                editLink: (override: ResAvailOverride) => `/admin/resources/${resourceId}/availability-overrides/${override.id}/edit`,
                onDelete: (override: ResAvailOverride) => handleDelete(override),
                deleteConfirmationMessage: (override: ResAvailOverride) => `Apakah Anda yakin ingin menghapus override tanggal ${override.start_datetime} - ${override.end_datetime}?`,
            }}
        />
    )
}