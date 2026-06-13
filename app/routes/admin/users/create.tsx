import { toast } from "sonner";
import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AdminPage } from "~/components/admin/admin-page";
import { FieldGroup } from "~/components/ui/field";
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormSelect } from "~/components/form-input/form-select";
import { userSchema, type UserSchema } from "~/features/users/schema/user-schema";
import { userApi } from "~/features/users/api/user-api";

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

export default function CreateUserPage() {
    const navigate = useNavigate();

    const form = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: userApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["user"]
            });
        }
    });

    async function onSubmit(values: UserSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = mutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Pengguna...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/users");
                }, 1000);
                return `Pengguna ${values.name} berhasil dibuat`;
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
                return "Gagal membuat Pengguna";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof UserSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Buat Pengguna Baru"
                    description="Form untuk membuat Pengguna baru"
                    backHref="/admin/users"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Pengguna</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={form.handleSubmit(
                                onSubmit
                            )}
                            className="space-y-6"
                        >
                            <FieldGroup>
                                <FormInputGroup
                                    form={form}
                                    name="name"
                                    label="Nama"
                                />

                                <FormInputGroup
                                    form={form}
                                    type="email"
                                    name="email"
                                    label="Email"
                                />

                                <FormInputGroup
                                    form={form}
                                    name="phone"
                                    label="Nomor Telepon"
                                />

                                <FormInputGroup
                                    form={form}
                                    name="password"
                                    label="Kata Sandi"
                                    type="password"
                                />

                                <FormInputGroup
                                    form={form}
                                    name="password_confirmation"
                                    label="Konfirmasi Kata Sandi"
                                    type="password"
                                />

                                <FormSelect
                                    form={form}
                                    name="role"
                                    label="Role"
                                    placeholder="Pilih Role"
                                    options={[
                                        {
                                            value: "admin",
                                            label: "Admin",
                                        },
                                        {
                                            value: "customer",
                                            label: "Pelanggan",
                                        },
                                    ]}
                                />
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