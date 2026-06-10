import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { Pencil, Trash } from "lucide-react";

export interface ActionColumnConfig<TData> {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    editLink?: (row: TData) => string;
    canEdit?: (row: TData) => boolean;
    canDelete?: (row: TData) => boolean;
    deleteConfirmationMessage?: (row: TData) => string;
}

export function createActionsColumn<TData>(
    config: ActionColumnConfig<TData>
): ColumnDef<TData> {
    return {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const data = row.original;
            const canEdit = config.canEdit?.(data) ?? true;
            const canDelete = config.canDelete?.(data) ?? true;

            const handleDelete = () => {
                if (config.deleteConfirmationMessage) {
                    if (confirm(config.deleteConfirmationMessage(data))) {
                        config.onDelete?.(data);
                    }
                } else if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                    config.onDelete?.(data);
                }
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
                                <Button variant="link" size="sm" className="h-8 w-8 p-0">
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
                                    onClick={handleDelete}
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