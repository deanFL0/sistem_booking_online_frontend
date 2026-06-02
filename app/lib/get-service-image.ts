import { serviceImages } from "../../public/service-images"

const fallbackImage =
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1"

export function getServiceImage(name: string) {
    return serviceImages[name] || fallbackImage
}