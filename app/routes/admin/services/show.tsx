import { AdminLayout } from "~/components/admin/admin-layout";
import { AdminPage } from "~/components/admin/admin-page";
import { AdminPageHeader } from "~/components/admin/admin-page-header";
import { useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { serviceApi } from "~/features/service/api/service-api";

export default function AdminServiceDetailPage() {
    const { id } = useParams();

    const { data: service } = useQuery({
        queryKey: ["service", id],
        queryFn: async () => {
            const res = await serviceApi.getById(id!);
            return res.data;
        },
        enabled: !!id,
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
                            <div>
                                <Label>Nama Layanan</Label>
                                <p>{service.name}</p>
                            </div>

                            <div>
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

                            <div>
                                <Label>Harga</Label>
                                <p>
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(service.price)}
                                </p>
                            </div>

                            <div>
                                <Label>Tipe Harga</Label>
                                <span
                                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
                                >
                                    {service.pricing_type === "hourly"
                                        ? "Per Jam"
                                        : "Sekali Bayar"}
                                </span>
                            </div>

                            <div>
                                <Label>Durasi</Label>
                                <p>{service.duration} menit</p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label>Deskripsi</Label>
                            <p className="mt-2 text-muted-foreground">
                                {service.description ||
                                    "Tidak ada deskripsi"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </AdminPage>
        </AdminLayout>
    );
}