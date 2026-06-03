import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../../components/ui/carousel"
import { Skeleton } from "../../../components/ui/skeleton"

import { Container } from "../../../components/layout/container"
import { ServiceCard } from "./service-card"
import { useServices } from "~/features/landing/api/service"

export function ServicesSection() {
    const { data, isLoading, isError } = useServices();

    if (isLoading) {
        return (
            <section className="py-20">
                <Container>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="overflow-hidden rounded-2xl border"
                            >
                                <Skeleton className="aspect-[4/3] w-full" />

                                <div className="space-y-3 p-5">
                                    <Skeleton className="h-5 w-2/3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        );
    }

    if (isError) {
        return <p>Gagal memuat layanan.</p>;
    }

    const services = data?.data || [];

    return (
        <section className="py-20">
            <Container>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <div className="mb-10 flex items-end justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-primary">
                                Layanan Kami
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                Pilih Layanan Favoritmu
                            </h2>
                        </div>
                    </div>

                    <div className="cursor-grab active:cursor-grabbing">
                        <CarouselContent>
                            {services.map((service) => (
                                <CarouselItem
                                    key={service.id}
                                    className="basis-[85%] md:basis-[45%] lg:basis-[32%]"
                                >
                                    <ServiceCard service={service} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="mt-10 flex items-end justify-end gap-4">
                            <p className="mt-2 text-muted-foreground">
                                Geser untuk melihat layanan lainnya
                            </p>
                            <div className="hidden md:flex gap-2">
                                <CarouselPrevious className="static translate-y-0" size={"lg"} />
                                <CarouselNext className="static translate-y-0" size={"lg"} />
                            </div>
                        </div>
                    </div>
                </Carousel>
            </Container>
        </section>
    );
}