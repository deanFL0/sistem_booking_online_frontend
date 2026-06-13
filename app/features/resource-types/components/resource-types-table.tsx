import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import type { ResourceTypes } from "../types/resource-types"
import { useDebouncedValue } from "~/hooks/use-debounce"
import { toast } from "sonner"
import { ResourceTypesApi } from "../api/resource-types-api"

export const columns: ColumnDef<ResourceTypes>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama Tipe Sumber Daya" />
        ),
        meta: {
            sortable: true,
            filterVariant: "text",
            filterLabel: "Nama Tipe Sumber Daya",
        },
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Deskripsi" />
        ),
        meta: {
            filterLabel: "Deskripsi",
        },
    },
]

export function ResourceTypesTable() {
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
        queryKey: ["resource-types", queryParams],

        queryFn: () => ResourceTypesApi.getAll(queryParams),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })

    const handleDelete = async (service: any) => {
        try {
            await ResourceTypesApi.delete(service.id);
            // Refresh data after successful deletion
            await query.refetch();
            toast.success("Berhasil menghapus tipe sumber daya");
        } catch (error) {
            toast.error("Gagal menghapus tipe sumber daya");
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

            showNumberColumn={true}

            actions={{
                viewLink: (resourceTypes: ResourceTypes) => `/admin/resource-types/${resourceTypes.id}`,
                editLink: (resourceTypes: ResourceTypes) => `/admin/resource-types/${resourceTypes.id}/edit`,
                onDelete: (resourceTypes: ResourceTypes) => handleDelete(resourceTypes),
                deleteConfirmationMessage: (resourceTypes: ResourceTypes) => `Apakah Anda yakin ingin menghapus tipe sumber daya "${resourceTypes.name}"?`,
            }}
        />
    )
}