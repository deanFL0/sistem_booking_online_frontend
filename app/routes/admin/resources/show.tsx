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
import { resourceApi } from "~/features/resources/api/resource-api";

export default function AdminResourceDetailPage() {
    const { id } = useParams();

    const { data: resource } = useQuery({
        queryKey: ["resource", id],
        queryFn: async () => {
            const res = await resourceApi.getById(id!);
            return res;
        },
        enabled: !!id,
    });

    if (!resource) {
        return (
            <AdminLayout>
                <AdminPage>
                    <div>Loading...</div>
                </AdminPage>
            </AdminLayout>
        )
    }
    console.log(resource.data)
    return (
        <AdminLayout>
            <AdminPage>
                <AdminPageHeader
                    title="Detail Sumber Daya"
                    description="Detail sumber daya yang tersedia"
                    backHref="/admin/resources"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{resource.name}</CardTitle>
                        <CardDescription>
                            ID: {resource.id}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Layanan</Label>
                                <p>{resource.name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Layanan</Label>
                                <p>{resource.resource_type.name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${resource.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {resource.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Deskripsi</Label>
                            <p className="text-muted-foreground">
                                {resource.description ||
                                    "Tidak ada deskripsi"}
                            </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Jam Operasi</Label>

                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dibuat</Label>
                                <div>
                                    <p>{new Date(resource.created_at).toLocaleString("id-ID", {
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
                                            new Date(resource.created_at),
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
                                    <p>{new Date(resource.updated_at).toLocaleString("id-ID", {
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
                                            new Date(resource.updated_at),
                                            {
                                                addSuffix: true,
                                                locale: idLocale,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}