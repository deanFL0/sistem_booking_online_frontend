import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { DataTable } from "~/components/data-table/data-table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ServiceResourceType } from "../types/service-resource-type";
import { serviceResourceTypeApi } from "../api/service-resource-type-api";

export const columns: ColumnDef<ServiceResourceType>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tipe Sumber Daya" />
        ),
    },
    {
        accessorKey: "pivot.quantity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Jumlah" />
        ),
    },
]

export function ServiceResourceTypeTable({ serviceId, resourceTypes }: { serviceId: string, resourceTypes: ServiceResourceType[] }) {
    const queryClient = useQueryClient();

    const handleDelete = async (service_resource_type: ServiceResourceType) => {
        try {
            await serviceResourceTypeApi.delete(serviceId, String(service_resource_type.id));
            // Refresh data after successful deletion
            await queryClient.invalidateQueries({
                queryKey: ["service", serviceId],
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
            data={resourceTypes}
            showNumberColumn={false}
            isLoading={false}
            isFetching={false}
            actions={{
                editLink: (service_resource_type: ServiceResourceType) => `/admin/services/${serviceId}/resource-types/${service_resource_type.id}/edit`,
                onDelete: (service_resource_type: ServiceResourceType) => handleDelete(service_resource_type),
                deleteConfirmationMessage: (service_resource_type: ServiceResourceType) => `Apakah Anda yakin ingin menghapus tipe sumber daya "${service_resource_type.name}"?`,
            }}
        />
    )
}