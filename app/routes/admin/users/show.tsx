import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { userApi } from "~/features/users/api/user-api";

export default function AdminUserDetailPage() {
    const { userId } = useParams<{ userId: string }>();

    const { data: user } = useQuery({
        queryKey: ["user", userId],
        queryFn: async () => {
            const res = await userApi.getById(userId!);
            return res;
        },
        enabled: !!userId,
    });

    if (!user) {
        return (
            <AdminLayout>
                <AdminPage>
                    <div>Loading...</div>
                </AdminPage>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Detail Pengguna"
                    description="Detail Pengguna yang tersedia"
                    backHref="/admin/users"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>
                            ID: {user.id}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama</Label>
                                <p>{user.name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Role</Label>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${user.role === "admin"
                                        ? "bg-green-500 text-white"
                                        : "bg-blue-500 text-white"
                                        }`}
                                >
                                    {user.role === "admin" ? "Admin" : "Customer"}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <p>{user.email}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <p>{user.phone}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <p>
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold 
                                                    transition-colors focus:outline-none focus:ring-2 
                                                    focus:ring-ring focus:ring-offset-2 
                                                    ${user.deleted_at === null
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                            }`}
                                    >
                                        {user.deleted_at === null ? "Aktif" : "Tidak Aktif"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Dibuat</Label>
                                <div>
                                    <p>{new Date(user.created_at).toLocaleString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZoneName: "short",
                                    })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(user.created_at),
                                            {
                                                addSuffix: true,
                                                locale: idLocale,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Terakhir Diperbarui</Label>
                                <div>
                                    <p>{new Date(user.updated_at).toLocaleString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        timeZoneName: "short",
                                    })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(
                                            new Date(user.updated_at),
                                            {
                                                addSuffix: true,
                                                locale: idLocale,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Dihapus Pada</Label>
                                {user.deleted_at === null ? "-" : (
                                    <div>
                                        <p>{new Date(user.deleted_at).toLocaleString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            timeZoneName: "short",
                                        })}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(
                                                new Date(user.deleted_at),
                                                {
                                                    addSuffix: true,
                                                    locale: idLocale,
                                                }
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}