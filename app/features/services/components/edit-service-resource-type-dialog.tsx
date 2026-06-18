import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import type { ServiceResourceType } from "../types/service-resource-type";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { Button } from "~/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { serviceResourceTypeApi } from "../api/service-resource-type-api";
import { toast } from "sonner";

type EditServiceResourceTypeDialogProps = {
    serviceId: string;
    resourceType: ServiceResourceType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditServiceResourceTypeDialog({
    serviceId,
    resourceType,
    open,
    onOpenChange,
}: EditServiceResourceTypeDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: {
            quantity: resourceType.pivot.quantity,
        },
    });

    useEffect(() => {
        form.reset({
            quantity: resourceType.pivot.quantity,
        });
    }, [resourceType, form]);

    const mutation = useMutation({
        mutationFn: (quantity: number) =>
            serviceResourceTypeApi.update(
                serviceId,
                String(resourceType.id),
                {
                    quantity,
                }
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["service", serviceId],
            });

            toast.success("Jumlah berhasil diubah");
            onOpenChange(false);
        },
    });

    const onSubmit = (data: { quantity: number }) => {
        mutation.mutate(data.quantity);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ubah Jumlah {resourceType.name}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormInputGroup
                        form={form}
                        name="quantity"
                        label="Jumlah"
                        type="number"
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Batal
                        </Button>

                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}