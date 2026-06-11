import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Eye, Pencil, Trash } from "lucide-react";

type DeleteDialogState<TData> = {
    isOpen: boolean;
    data: TData | null;
    message: string;
};

export interface ActionColumnConfig<TData> {
    canView?: (row: TData) => boolean;
    canEdit?: (row: TData) => boolean;
    canDelete?: (row: TData) => boolean;
    onView?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    viewLink?: (row: TData) => string;
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
            const canView = config.canView?.(data) ?? true;
            const canEdit = config.canEdit?.(data) ?? true;
            const canDelete = config.canDelete?.(data) ?? true;

            const handleDeleteClick = () => {
                const message = config.deleteConfirmationMessage?.(data)
                    ?? "Apakah Anda yakin ingin menghapus data ini?";

                deleteDialogState.openDialog(data, message);
            };

            return (
                <div className="flex items-center gap-2">
                    {canView && config.onView && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => config.onView?.(data)}
                                >
                                    <Eye className="size-5" color="green" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Lihat</TooltipContent>
                        </Tooltip>
                    )}

                    {canView && config.viewLink && (
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <Link to={config.viewLink(data)}>
                                        <Eye className="size-5" color="green" />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Lihat</TooltipContent>
                        </Tooltip>
                    )}

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