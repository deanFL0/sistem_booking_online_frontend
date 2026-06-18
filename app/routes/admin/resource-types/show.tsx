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
import { ResourceTypesApi } from "~/features/resource-types/api/resource-types-api";

export default function AdminServiceDetailPage() {
    const { serviceId } = useParams<{ serviceId: string }>();

    const { data: resourceType } = useQuery({
        queryKey: ["resource-type", serviceId],
        queryFn: async () => {
            const res = await ResourceTypesApi.getById(serviceId!);
            return res;
        },
        enabled: !!serviceId,
    });

    if (!resourceType) {
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
                    title="Detail Tipe Sumber Daya"
                    description="Detail tipe sumber daya yang tersedia"
                    backHref="/admin/resource-types"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{resourceType.name}</CardTitle>
                        <CardDescription>
                            ID: {resourceType.serviceId}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Tipe Sumber Daya</Label>
                                <p>{resourceType.name}</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label>Deskripsi</Label>
                            <p className="mt-2 text-muted-foreground">
                                {resourceType.description ||
                                    "Tidak ada deskripsi"}
                            </p>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dibuat</Label>
                                <div>
                                    <p>{new Date(resourceType.created_at).toLocaleString("id-ID", {
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
                                            new Date(resourceType.created_at),
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
                                    <p>{new Date(resourceType.updated_at).toLocaleString("id-ID", {
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
                                            new Date(resourceType.updated_at),
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