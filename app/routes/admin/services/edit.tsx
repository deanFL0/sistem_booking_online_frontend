import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { serviceApi } from "~/features/service/api/service-api";
import { serviceSchema, type ServiceSchema } from "~/features/service/schema/service-create-schema";
import { useEffect } from "react";

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

export default function EditServicePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const form = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    // Fetch service data
    const { data: service, isLoading: isLoadingService } = useQuery({
        queryKey: ["service", id],
        queryFn: () => serviceApi.getById(id!),
        enabled: !!id,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (service) {
            form.reset({
                name: service.data.name,
                description: service.data.description,
                price: service.data.price,
                pricing_type: service.data.pricing_type,
                duration: service.data.duration,
                is_active: service.data.is_active,
            });
        }
    }, [service, form]);

    const updateMutation = useMutation({
        mutationFn: (data: ServiceSchema) => serviceApi.update(id!, data),
        onSuccess: () => {
            // Invalidate and refetch both the list and the individual service
            queryClient.invalidateQueries({ queryKey: ["services"] });
            queryClient.invalidateQueries({ queryKey: ["service", id] });
        },
    });

    async function onSubmit(values: ServiceSchema) {
        try {
            await toast.promise(
                updateMutation.mutateAsync(values),
                {
                    loading: "Menyimpan perubahan...",
                }
            );

            toast.success("Layanan berhasil diperbarui", {
                description: `${values.name} telah diperbarui`,
            });

            setTimeout(() => {
                navigate("/admin/services");
            }, 1000);
        } catch (error) {
            toast.error("Gagal memperbarui layanan");
        }
    }

    if (isLoadingService) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Layanan"
                        description="Memuat data layanan..."
                        backHref="/admin/services"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Memuat...
                            </div>
                        </CardContent>
                    </Card>
                </AdminPage>
            </AdminLayout>
        );
    }

    if (!service) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Layanan"
                        description="Layanan tidak ditemukan"
                        backHref="/admin/services"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Layanan tidak ditemukan
                            </div>
                        </CardContent>
                    </Card>
                </AdminPage>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Edit Layanan"
                    description="Form untuk mengedit layanan"
                    backHref="/admin/services"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Layanan</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <Field>
                                    <FieldLabel>
                                        Nama Layanan
                                    </FieldLabel>
                                    <Input
                                        {...form.register("name")}
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
                                    <FieldError
                                        message={form.formState.errors.description?.message}
                                    />
                                </Field>
                                <div className="flex items-center justify-between gap-2">
                                    <Field>
                                        <FieldLabel>
                                            Harga
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon align={"inline-start"}>Rp</InputGroupAddon>
                                            <InputGroupInput
                                                type="number"
                                                {...form.register("price", { valueAsNumber: true })}
                                                aria-invalid={!!form.formState.errors.price}
                                            />
                                        </InputGroup>
                                        <FieldError
                                            message={form.formState.errors.price?.message}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Tipe Harga</FieldLabel>
                                        <Controller
                                            name="pricing_type"
                                            control={form.control}
                                            render={({ field }) => {
                                                const getCurrentLabel = () => {
                                                    switch (field.value) {
                                                        case "one_time": return "Sekali Bayar";
                                                        case "hourly": return "Per Jam";
                                                        default: return "Pilih Tipe Harga";
                                                    }
                                                };

                                                return (
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-full">
                                                            <span>
                                                                {getCurrentLabel()}
                                                            </span>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="one_time">Sekali Bayar</SelectItem>
                                                            <SelectItem value="hourly">Per Jam</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                );
                                            }}
                                        />
                                        <FieldError
                                            message={form.formState.errors.pricing_type?.message}
                                        />
                                    </Field>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <Field>
                                        <FieldLabel>
                                            Durasi
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                type="number"
                                                {...form.register("duration", { valueAsNumber: true })}
                                                aria-invalid={!!form.formState.errors.duration}
                                            />
                                            <InputGroupAddon align={"inline-end"}>
                                                Menit
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldError
                                            message={form.formState.errors.duration?.message}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel>
                                            Apakah Layanan Aktif?
                                        </FieldLabel>
                                        <Controller
                                            name="is_active"
                                            control={form.control}
                                            render={({ field }) => {
                                                const getCurrentLabel = () => {
                                                    switch (field.value) {
                                                        case true: return "Aktif";
                                                        case false: return "Nonaktif";
                                                        default: return "Pilih Status";
                                                    }
                                                };

                                                return (
                                                    <Select
                                                        onValueChange={(value) => field.onChange(value === "true")}
                                                        value={String(field.value)}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <span>
                                                                {getCurrentLabel()}
                                                            </span>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="true">Aktif</SelectItem>
                                                            <SelectItem value="false">Nonaktif</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                );
                                            }}
                                        />
                                        <FieldError
                                            message={form.formState.errors.is_active?.message}
                                        />
                                    </Field>
                                </div>
                            </FieldGroup>

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/admin/services")}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}