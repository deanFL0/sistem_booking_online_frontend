import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { FieldGroup } from "~/components/ui/field";
import { serviceResourceTypeSchema, type ServiceResourceTypeSchema } from "~/features/services/schema/service-resource-type-schema";
import { serviceResourceTypeApi } from "~/features/services/api/service-resource-type-api";
import { ResourceTypesApi } from "~/features/resource-types/api/resource-types-api";
import { FormSearchableSelect } from "~/components/form-input/form-searchable-select";
import { FormInputGroup } from "~/components/form-input/form-input-group";

type FieldErrorProps = {
    message?: string;
};

export function FieldError({ message }: FieldErrorProps) {
    if (!message) return null;

    return (
        <p className="text-sm text-destructive">
            {message}
        </p>
    );
}

export default function AdminCreateServiceResourceTypePage() {
    const { serviceId, resourceTypeId } = useParams<{ serviceId: string, resourceTypeId: string }>();
    const navigate = useNavigate();

    const form = useForm<ServiceResourceTypeSchema>({
        resolver: zodResolver(serviceResourceTypeSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: ServiceResourceTypeSchema) => {
            return await serviceResourceTypeApi.create(serviceId as string, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["service", serviceId, "resource-types"]
            });
        }
    });

    async function onSubmit(values: ServiceResourceTypeSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Tipe Sumber Daya...",
            success: () => {
                setTimeout(() => {
                    queryClient.invalidateQueries({
                        queryKey: ["service", serviceId]
                    });
                    navigate(`/admin/services/${serviceId}`);
                }, 1000);
                return `Tipe Sumber Daya berhasil ditambahkan`;
            },
            error: (error: any) => {
                // Extract error message
                if (error.response?.data?.message) {
                    return error.response.data.message;
                }
                if (error.response?.data?.errors) {
                    const errors = error.response.data.errors;
                    const firstError = Object.values(errors)[0];
                    if (Array.isArray(firstError)) {
                        return firstError[0];
                    }
                    return String(firstError);
                }
                return "Gagal membuat Layanan";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof ServiceResourceTypeSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    // fetch resource types options
    const resourceTypesQuery = useQuery({
        queryKey: ["resource-types-options"],
        queryFn: () => ResourceTypesApi.getAllResourceTypes(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Menambahkan Tipe Sumber Daya Baru"
                    description="Form untuk menambahkan Tipe Sumber Daya baru pada Layanan"
                    backHref={`/admin/services/${serviceId}`}
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Tipe Sumber Daya</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <div className="flex gap-4">
                                    <FormSearchableSelect
                                        form={form}
                                        name="resource_type_id"
                                        label="Tipe Sumber Daya"
                                        placeholder="Pilih Tipe Sumber Daya"
                                        options={
                                            resourceTypesQuery.data?.map((item: any) => ({
                                                value: item.id,
                                                label: item.name,
                                            })) || []
                                        }
                                    />
                                    <FormInputGroup
                                        form={form}
                                        name="quantity"
                                        label="Jumlah"
                                        type="number"
                                        placeholder="Masukkan Jumlah"
                                    />
                                </div>
                            </FieldGroup>

                            <Button
                                type="submit"
                                disabled={
                                    mutation.isPending
                                }
                            >
                                {mutation.isPending
                                    ? "Menyimpan..."
                                    : "Simpan"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}