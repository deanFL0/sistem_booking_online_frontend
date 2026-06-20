import type { Service } from "~/features/services/types/service"

import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Link } from "react-router"

interface ServiceCardProps {
    service: Service
}
export function ServiceCard({
    service,
}: ServiceCardProps) {
    return (
        <Card className="overflow-hidden rounded-2xl h-full flex flex-col">
            <div className="aspect-[4/3] shrink-0 overflow-hidden">
                <img
                    src={service.image_url ? service.image_url : '/images/service-default.jpg'}
                    alt={service.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            <CardContent className="flex flex-col flex-grow p-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-semibold line-clamp-2">
                            {service.name}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {service.description ||
                                "Layanan profesional dengan kualitas terbaik."}
                        </p>
                    </div>

                    <p className="font-bold whitespace-nowrap">
                        {service.formatted_total_price}
                    </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                        {service.duration} menit
                    </p>

                    <Button size="sm" render={<Link to={`/services/${service.id}/book`} />}>
                        Booking
                    </Button>
                </div>
            </CardContent>
        </Card >
    )
}