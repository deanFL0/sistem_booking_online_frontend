import {
    Calendar,
    Scissors,
    Star,
    Store,
} from "lucide-react"

import { Container } from "../layout/container"

const features = [
    {
        title: "Barber Profesional",
        description:
            "Ditangani oleh barber berpengalaman dan terpercaya.",
        icon: Scissors,
    },
    {
        title: "Booking Mudah",
        description:
            "Reservasi online cepat dan praktis kapan saja.",
        icon: Calendar,
    },
    {
        title: "Pelayanan Terbaik",
        description:
            "Fokus pada kenyamanan dan kepuasan pelanggan.",
        icon: Star,
    },
    {
        title: "Tempat Nyaman",
        description:
            "Suasana modern, bersih, dan nyaman untuk bersantai.",
        icon: Store,
    },
]

export function WhyChooseUsSection() {
    return (
        <section className="py-20">
            <Container>
                {/* Heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-medium text-primary">
                        Kenapa Memilih Kami
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                        Pengalaman Grooming yang Nyaman
                        dan Profesional
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                        Kami memberikan pelayanan terbaik
                        dengan kualitas premium untuk setiap pelanggan.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => {
                        const Icon = feature.icon

                        return (
                            <div
                                key={feature.title}
                                className="
                                    rounded-2xl
                                    border
                                    bg-background
                                    p-6
                                    transition-colors
                                    hover:bg-muted/50"
                            >
                                <div
                                    className="
                                        flex size-12 items-center
                                        justify-center rounded-xl
                                        bg-primary/10"
                                >
                                    <Icon className="size-6 text-primary" />
                                </div>

                                <h3 className="mt-5 font-semibold">
                                    {feature.title}
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}