import { toast } from "sonner";
import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
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

export default function CreateServicePage() {
    const navigate = useNavigate();

    const form = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
    });

    const mutation = useMutation({
        mutationFn: serviceApi.create,
    });

    async function onSubmit(values: ServiceSchema) {
        try {
            await toast.promise(
                mutation.mutateAsync(values),
                {
                    loading: "Menyimpan layanan...",
                }
            );

            toast.success("Layanan berhasil dibuat", {
                description: `${values.name} telah ditambahkan`,
            });

            setTimeout(() => {
                navigate("/admin/services");
            }, 1000);
        } catch (error) {
            toast.error("Gagal membuat layanan");
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
                    title="Buat Layanan Baru"
                    description="Form untuk membuat layanan baru"
                    backHref="/admin/services"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Layanan</CardTitle>
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
                                        Nama Layanan
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
                                                // Store the label in state or compute it
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
                                                // Store the label in state or compute it
                                                const getCurrentLabel = () => {
                                                    switch (field.value) {
                                                        case true: return "Aktif";
                                                        case false: return "Nonaktif";
                                                        default: return "Pilih Status";
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
                                                            <SelectItem value={true}>Aktif</SelectItem>
                                                            <SelectItem value={false}>Nonaktif</SelectItem>
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