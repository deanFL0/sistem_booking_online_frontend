import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { resourceTypeSchema, type ResourceTypeSchema } from "~/features/resource-types/schema/resource-types-schema";
import { ResourceTypesApi } from "~/features/resource-types/api/resource-types-api";

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

export default function CreateResourceTypePage() {
    const navigate = useNavigate();

    const form = useForm<ResourceTypeSchema>({
        resolver: zodResolver(resourceTypeSchema),
    });

    const mutation = useMutation({
        mutationFn: ResourceTypesApi.create,
    });

    async function onSubmit(values: ResourceTypeSchema) {
        try {
            await toast.promise(
                mutation.mutateAsync(values),
                {
                    loading: "Menyimpan Tipe Sumber Daya...",
                }
            );

            toast.success("Tipe Sumber Daya berhasil dibuat", {
                description: `${values.name} telah ditambahkan`,
            });

            setTimeout(() => {
                navigate("/admin/resource-types");
            }, 1000);
        } catch (error) {
            toast.error("Gagal membuat Tipe Sumber Daya");
        }
    }

    const pricingTypeLabel = {
        one_time: "Sekali Bayar",
        hourly: "Per Jam",
    };

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Buat Tipe Sumber Daya Baru"
                    description="Form untuk membuat Tipe Sumber Daya baru"
                    backHref="/admin/resource-types"
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
                                <Field>
                                    <FieldLabel>
                                        Nama Tipe Sumber Daya
                                    </FieldLabel>
                                    <Input {...form.register("name")}
                                        aria-invalid={!!form.formState.errors.name}
                                    />
                                    <FieldError
                                        message={form.formState.errors.name?.message}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Deskripsi
                                    </FieldLabel>
                                    <Textarea {...form.register("description")} />
                                </Field>
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