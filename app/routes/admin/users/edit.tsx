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
import { FormInputGroup } from "~/components/form-input/form-input-group";
import { FormSelect } from "~/components/form-input/form-select";
import { updateUserSchema, type UpdateUserSchema } from "~/features/users/schema/user-schema";
import { userApi } from "~/features/users/api/user-api";
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

export default function EditUserPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const form = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
    });

    // Fetch user data
    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ["user", id],
        queryFn: () => userApi.getById(id!),
        enabled: !!id,
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
                phone: user.phone!,
                role: user.role,
            });
        }
    }, [user, form]);

    const updateMutation = useMutation({
        mutationFn: (data: UpdateUserSchema) => userApi.update(id!, data),
        onSuccess: () => {
            // Invalidate and refetch both the list and the individual user
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["user", id] });
        },
    });


    async function onSubmit(values: UpdateUserSchema) {
        // Create a promise that handles the mutation
        const mutationPromise = updateMutation.mutateAsync(values);

        toast.promise(mutationPromise, {
            loading: "Menyimpan Pengguna...",
            success: () => {
                setTimeout(() => {
                    navigate("/admin/users");
                }, 1000);
                return `Pengguna ${values.name} berhasil diubah`;
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
                return "Gagal mengubah Pengguna";
            }
        });

        // Set field errors from server
        try {
            await mutationPromise;
        } catch (error: any) {
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                Object.entries(serverErrors).forEach(([field, messages]) => {
                    form.setError(field as keyof UpdateUserSchema, {
                        type: "server",
                        message: Array.isArray(messages) ? messages[0] : messages as string
                    });
                });
            }
        }
    }

    if (isLoadingUser) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Pengguna"
                        description="Memuat data pengguna..."
                        backHref="/admin/users"
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

    if (!user) {
        return (
            <AdminLayout>
                <AdminPage>
                    <AdminPageHeader
                        title="Edit Pengguna"
                        description="Pengguna tidak ditemukan"
                        backHref="/admin/users"
                    />
                    <Card>
                        <CardContent className="py-8">
                            <div className="text-center text-muted-foreground">
                                Pengguna tidak ditemukan
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
                    title="Ubah Data Pengguna"
                    description="Form untuk mengubah Data Pengguna"
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
                                    updateMutation.isPending
                                }
                            >
                                {updateMutation.isPending
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