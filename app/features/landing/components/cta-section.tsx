import { Link } from "react-router"

import { Button } from "../../../components/ui/button"
import { Container } from "../../../components/layout/container"

export function CTASection() {
    return (
        <section className="py-20">
            <Container>
                <div
                    className="
                        overflow-hidden rounded-3xl
                        border bg-muted/40 px-6 py-16
                        text-center md:px-12
                    "
                >
                    <div className="mx-auto max-w-2xl">
                        <p className="text-sm font-medium text-primary">
                            Booking Sekarang
                        </p>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
                            Siap Tampil Lebih Percaya Diri?
                        </h2>

                        <p className="mt-5 text-muted-foreground md:text-lg">
                            Booking layanan favoritmu sekarang
                            dengan cepat dan mudah tanpa perlu antre.
                        </p>

                        <div className="mt-8">
                            <Button size="lg" asChild>
                                <Link to="/services">
                                    Booking Sekarang
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}