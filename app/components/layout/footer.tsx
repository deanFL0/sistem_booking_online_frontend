import { Link } from "react-router"

import { Container } from "./container"

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <Container>
                <div
                    className="
                        grid gap-12 py-16
                        md:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-bold">
                            BarberShop
                        </h3>

                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                            Potongan rambut premium dengan
                            pelayanan profesional dan booking
                            online yang mudah.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-semibold">
                            Navigasi
                        </h4>

                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-foreground"
                                >
                                    Beranda
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/services"
                                    className="hover:text-foreground"
                                >
                                    Layanan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold">
                            Kontak
                        </h4>

                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li>
                                WhatsApp: +62 812-3456-7890
                            </li>

                            <li>
                                Instagram: @barbershop
                            </li>

                            <li>
                                Senin - Minggu
                                <br />
                                10:00 - 21:00
                            </li>
                        </ul>
                    </div>
                </div>
            </Container>

            {/* Bottom */}
            <div className="border-t">
                <Container>
                    <div
                        className="
                            py-6 text-center text-sm
                            text-muted-foreground
                        "
                    >
                        © 2026 BarberShop. All rights reserved.
                    </div>
                </Container>
            </div>
        </footer>
    )
}