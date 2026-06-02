import { Button } from "../ui/button"
import { Container } from "../layout/container"
import { Link } from "react-router"

export function HeroSection() {
    return (
        <section className="overflow-hidden py-20 md:py-32">
            <Container>
                <div className="grid gap-12 md:grid-cols-2 md:items-center">
                    {/* Left Content */}
                    <div>
                        <p className="mb-4 text-sm font-medium text-primary">
                            Barber Shop Premium
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                            Tampil Lebih Percaya Diri
                            dengan Potongan Terbaik
                        </h1>

                        <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                            Booking haircut, beard trim, dan grooming
                            favoritmu secara online tanpa ribet.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button size="lg" asChild>
                                <Link to={"/services"}>
                                    Lihat Layanan
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex items-center gap-8">
                            <div>
                                <p className="text-2xl font-bold">
                                    4.9★
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Rating Pelanggan
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-bold">
                                    500+
                                </p>

                                <p className="text-sm text-muted-foreground">
                                    Pelanggan Puas
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative">
                        <div className="overflow-hidden rounded-3xl border bg-muted">
                            <img
                                src="https://images.unsplash.com/photo-1622287162716-f311baa1a2b8"
                                alt="Barber Shop"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 rounded-2xl border bg-background p-4 shadow-lg">
                            <p className="text-sm text-muted-foreground">
                                Mulai dari
                            </p>

                            <p className="text-2xl font-bold">
                                Rp 80.000
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}