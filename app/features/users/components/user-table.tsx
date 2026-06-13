import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { useDebouncedValue } from "~/hooks/use-debounce"
import { toast } from "sonner"
import type { User } from "../types/user"
import { userApi } from "../api/user-api"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        meta: {
            sortable: true,
            filterVariant: "text",
            filterLabel: "Nama",
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        meta: {
            sortable: true,
            filterVariant: "text",
            filterLabel: "Email",
        },
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
        meta: {
            filterVariant: "text",
            filterLabel: "Phone",
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${row.original.role === "admin"
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                    }`}
            >
                {row.original.role === "admin" ? "Admin" : "Customer"}
            </span>
        ),
        meta: {
            sortable: true,
            filterVariant: "multi-choice",
            filterLabel: "Role",
            filterOptions: [
                { label: "Admin", value: "admin" },
                { label: "Customer", value: "customer" },
            ],
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${row.original.deleted_at === null
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}
            >
                {row.original.deleted_at === null ? "Aktif" : "Tidak Aktif"}
            </span>
        ),
        meta: {
            filterVariant: "multi-choice",
            filterLabel: "Status",
            filterOptions: [
                { label: "Aktif", value: "active" },
                { label: "Tidak Aktif", value: "inactive" },
            ],
        },
    },
]

export function UserTable() {
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
        queryKey: ["users", queryParams],

        queryFn: () => userApi.getAll(queryParams),

        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })

    const handleDelete = async (user: any) => {
        try {
            await userApi.delete(user.id);
            // Refresh data after successful deletion
            await query.refetch();
            toast.success("User deleted successfully");
        } catch (error) {
            toast.error("Failed to delete user");
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

            showNumberColumn={true}

            isLoading={
                query.isLoading
            }

            actions={{
                viewLink: (user: User) => `/admin/users/${user.id}`,
                editLink: (user: User) => `/admin/users/${user.id}/edit`,
                onDelete: (user: User) => handleDelete(user),
                deleteConfirmationMessage: (user: User) => `Apakah Anda yakin ingin menghapus pengguna "${user.name}"?`,
            }}
        />
    )
}