import { Quote } from "lucide-react"

import { Container } from "../../../components/layout/container"

const testimonials = [
    {
        name: "Andi Saputra",
        service: "Haircut Classic",
        review:
            "Tempatnya nyaman dan hasil potongannya selalu rapi. Barbernya juga ramah banget.",
    },
    {
        name: "Rizky Pratama",
        service: "Beard Trim",
        review:
            "Booking online jadi lebih gampang dan cepat. Tidak perlu antre lama lagi.",
    },
    {
        name: "Fajar Nugraha",
        service: "Hair Coloring",
        review:
            "Pelayanannya profesional dan hasilnya sesuai ekspektasi. Recommended banget.",
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-20">
            <Container>
                {/* Heading */}
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-medium text-primary">
                        Testimoni Pelanggan
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                        Apa Kata Pelanggan Kami
                    </h2>

                    <p className="mt-4 text-muted-foreground">
                        Kepuasan pelanggan adalah prioritas utama kami.
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="
                                flex h-full flex-col
                                rounded-2xl border
                                bg-background p-6
                            "
                        >
                            {/* Quote Icon */}
                            <div
                                className="
                                    flex size-10 items-center
                                    justify-center rounded-full
                                    bg-primary/10
                                    "
                            >
                                <Quote className="size-5 text-primary" />
                            </div>

                            {/* Review */}
                            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                                "{testimonial.review}"
                            </p>

                            {/* Footer */}
                            <div className="mt-auto pt-6">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div
                                        className="
                                            flex size-10 items-center
                                            justify-center rounded-full
                                            bg-muted font-medium
                                            "
                                    >
                                        {testimonial.name.charAt(0)}
                                    </div>

                                    <div>
                                        <p className="font-medium">
                                            {testimonial.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {testimonial.service}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}