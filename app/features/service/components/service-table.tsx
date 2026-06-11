import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { getServices } from "../api/getServices"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { Service } from "../types/service"
import { formatServicePrice } from "~/lib/format-service-price"
import { useDebouncedValue } from "~/hooks/use-debounce"
import { toast } from "sonner"
import { deleteService } from "../api/deleteService"

export const columns: ColumnDef<Service>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Layanan" />
        ),
        meta: {
            sortable: true,
            filterVariant: "text",
            filterLabel: "Nama Layanan",
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Harga" />
        ),
        cell: ({ row }) => formatServicePrice(row.original),
        meta: {
            sortable: true,
            filterVariant: "number-range",
            filterLabel: "Harga",
        },
    },
    {
        accessorKey: "duration",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Durasi" />
        ),
        cell: ({ row }) => `${row.original.duration} menit`,
        meta: {
            sortable: true,
            filterVariant: "number-range",
            filterLabel: "Durasi",
        },
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${row.original.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
            >
                {row.original.is_active ? "Aktif" : "Nonaktif"}
            </span>
        ),
        meta: {
            filterVariant: "multi-choice",
            filterLabel: "Status",
            filterOptions: [
                { label: "Aktif", value: "true" },
                { label: "Nonaktif", value: "false" },
            ],
        },
    },
]

export function ServiceTable() {
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
        queryKey: ["services", queryParams],

        queryFn: () => getServices(queryParams),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })

    const handleDelete = async (service: any) => {
        try {
            await deleteService(service.id);
            // Refresh data after successful deletion
            await query.refetch();
            toast.success("Service deleted successfully");
        } catch (error) {
            toast.error("Failed to delete service");
            throw error; // Re-throw to handle in dialog
        }
    };

    return (
        <DataTable
            columns={columns}
            data={
                query.data?.data ?? []
            }

            pageCount={
                query.data?.meta
                    ?.last_page ?? 0
            }

            pagination={pagination}
            onPaginationChange={
                setPagination
            }

            sorting={sorting}
            onSortingChange={
                setSorting
            }

            filters={filters}
            onFiltersChange={
                setFilters
            }

            isLoading={
                query.isLoading
            }

            actions={{
                viewLink: (service: Service) => `/admin/services/${service.id}`,
                editLink: (service: Service) => `/admin/services/${service.id}/edit`,
                onDelete: (service: Service) => handleDelete(service),
                deleteConfirmationMessage: (service: Service) => `Apakah Anda yakin ingin menghapus layanan "${service.name}"?`,
            }}
        />
    )
}