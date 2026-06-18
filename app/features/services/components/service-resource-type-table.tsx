import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header";
import { DataTable } from "~/components/data-table/data-table";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ServiceResourceType } from "../types/service-resource-type";
import { serviceResourceTypeApi } from "../api/service-resource-type-api";
import { useState } from "react";
import { EditServiceResourceTypeDialog } from "./edit-service-resource-type-dialog";

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
    const [selected, setSelected] =
        useState<ServiceResourceType | null>(null);

    const [open, setOpen] = useState(false);

    const queryClient = useQueryClient();

    const handleDelete = async (service_resource_type: ServiceResourceType) => {
        try {
            await serviceResourceTypeApi.delete(serviceId, String(service_resource_type.id));
            // Refresh data after successful deletion
            await queryClient.invalidateQueries({
                queryKey: ["service", serviceId],
            })
            toast.success(`Tipe sumber daya "${service_resource_type.name}" berhasil diputuskan dari layanan`);
        } catch (error) {
            toast.error("Gagal memutus tipe sumber daya dari layanan");
            throw error; // Re-throw to handle in dialog
        }
    }

    const handleEdit = (
        resourceType: ServiceResourceType
    ) => {
        setSelected(resourceType);
        setOpen(true);
    };

    return (
        <>
            <DataTable
                columns={columns}
                data={resourceTypes}
                showNumberColumn={false}
                isLoading={false}
                isFetching={false}
                actions={{
                    onEdit: handleEdit,
                    onDelete: (service_resource_type: ServiceResourceType) => handleDelete(service_resource_type),
                    deleteConfirmationMessage: (service_resource_type: ServiceResourceType) => `Apakah Anda yakin ingin menghapus tipe sumber daya "${service_resource_type.name}"?`,
                }}
            />

            {open && selected && (
                <EditServiceResourceTypeDialog
                    serviceId={serviceId}
                    resourceType={selected}
                    open={open}
                    onOpenChange={setOpen}
                />
            )}
        </>
    )
}