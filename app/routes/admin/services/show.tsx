import { AdminLayout } from "~/components/layout/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { data, Link, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { serviceApi } from "~/features/services/api/service-api";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ServiceResourceTypeTable } from "~/features/services/components/service-resource-type-table";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminServiceDetailPage() {
    const { serviceId } = useParams<{ serviceId: string }>();

    const { data: service } = useQuery({
        queryKey: ["service", serviceId],
        queryFn: async () => {
            const res = await serviceApi.getById(serviceId!);
            return res;
        },
        enabled: !!serviceId,
    });

    if (!service) {
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
                    title="Detail Layanan"
                    description="Detail layanan yang tersedia"
                    backHref="/admin/services"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription>
                            ID: {service.id}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Layanan</Label>
                                <p>{service.name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${service.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {service.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label>Harga</Label>
                                <p>
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(service.price)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Harga</Label>
                                <span
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
                                >
                                    {service.pricing_type === "hourly"
                                        ? "Per Jam"
                                        : "Sekali Bayar"}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <Label>Durasi</Label>
                                <p>{service.duration} menit</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Deskripsi</Label>
                            <p className="text-muted-foreground">
                                {service.description ||
                                    "Tidak ada deskripsi"}
                            </p>
                        </div>

                        <Separator />

                        <div className="flex justify-between">
                            <Label>Tipe Sumber Daya yang ditetapkan untuk Layanan Ini</Label>

                            <Button
                                render={
                                    <Link to={`/admin/services/${service.id}/resource-types/create`}>
                                        <Plus />
                                        Tambah Tipe Sumber Daya
                                    </Link>
                                }
                            />
                        </div>
                        <ServiceResourceTypeTable serviceId={serviceId as string} resourceTypes={service.resource_types || []} />

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Dibuat</Label>
                                <div>
                                    <p>{new Date(service.created_at).toLocaleString("id-ID", {
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
                                            new Date(service.created_at),
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
                                    <p>{new Date(service.updated_at).toLocaleString("id-ID", {
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
                                            new Date(service.updated_at),
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