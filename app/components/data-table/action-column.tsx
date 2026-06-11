import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Pencil, Trash } from "lucide-react";

type DeleteDialogState<TData> = {
    isOpen: boolean;
    data: TData | null;
    message: string;
};

export interface ActionColumnConfig<TData> {
    canEdit?: (row: TData) => boolean;
    canDelete?: (row: TData) => boolean;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    editLink?: (row: TData) => string;
    deleteConfirmationMessage?: (row: TData) => string;
}


export function createActionsColumn<TData>(
    config: ActionColumnConfig<TData>,
    deleteDialogState: {
        isOpen: boolean;
        data: TData | null;
        message: string;
        openDialog: (data: TData, message: string) => void;
        closeDialog: () => void;
    }
): ColumnDef<TData> {
    return {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const data = row.original;
            const canEdit = config.canEdit?.(data) ?? true;
            const canDelete = config.canDelete?.(data) ?? true;

            const handleDeleteClick = () => {
                const message = config.deleteConfirmationMessage?.(data)
                    ?? "Apakah Anda yakin ingin menghapus data ini?";

                deleteDialogState.openDialog(data, message);
            };

            return (
                <div className="flex items-center gap-2">
                    {config.onEdit && canEdit && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => config.onEdit?.(data)}
                                >
                                    <Pencil className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                    )}

                    {config.editLink && canEdit && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <Link to={config.editLink(data)}>
                                        <Pencil className="size-5" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                    )}

                    {config.onDelete && canDelete && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash className="size-5" color="red" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Hapus</TooltipContent>
                        </Tooltip>
                    )}
                </div>
            );
        },
    };
}