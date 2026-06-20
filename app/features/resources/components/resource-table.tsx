import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { useDebouncedValue } from "~/hooks/use-debounce"
import { toast } from "sonner"
import type { Resource } from "../types/resource"
import { resourceApi } from "../api/resource-api"

export const columns: ColumnDef<Resource>[] = [
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
        accessorKey: "resource_type.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe" />
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Deskripsi" />
        ),
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
            sortable: true,
            filterVariant: "multi-choice",
            filterLabel: "Status",
            filterOptions: [
                { label: "Aktif", value: "true" },
                { label: "Nonaktif", value: "false" },
            ],
        },
    },
]

export function ResourceTable() {
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
            includes: ["resource_type", "operational_hours"],
        }),
        [pagination, sorting, debouncedFilters]
    )

    const query = useQuery({
        queryKey: ["resources", queryParams],

        queryFn: () => resourceApi.getAll(queryParams),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })

    const handleDelete = async (resource: any) => {
        try {
            await resourceApi.delete(resource.id);
            // Refresh data after successful deletion
            await query.refetch();
            toast.success("Resource deleted successfully");
        } catch (error) {
            toast.error("Failed to delete resource");
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
                viewLink: (resource: Resource) => `/admin/resources/${resource.id}`,
                editLink: (resource: Resource) => `/admin/resources/${resource.id}/edit`,
                onDelete: (resource: Resource) => handleDelete(resource),
                deleteConfirmationMessage: (resource: Resource) => `Apakah Anda yakin ingin menghapus sumber daya "${resource.name}"?`,
            }}
            getRowClassName={(resource) => {
                if (resource.operational_hours?.length === 0) {
                    return "border-l-4 bg-yellow-50/50 shadow-[inset_4px_0_0_0_rgb(239_68_68)]"
                }
                return ""
            }}
        />
    )
}