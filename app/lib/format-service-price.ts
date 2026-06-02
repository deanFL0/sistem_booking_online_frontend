import type { Service } from "~/features/service/service"

export function formatServicePrice(service: Service) {
    const formattedPrice = new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }
    ).format(service.price)

    if (service.pricing_type === "hourly") {
        return `${formattedPrice}/jam`
    }

    return formattedPrice
}