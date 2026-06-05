import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Navbar } from "~/components/layout/navbars/navbar";
import { HeroSection } from "~/features/landing/components/hero-section";
import { ServicesSection } from "~/features/landing/components/service-section";
import { WhyChooseUsSection } from "~/features/landing/components/why-choose-use-section";
import { TestimonialsSection } from "~/features/landing/components/testimonials-section";
import { CTASection } from "~/features/landing/components/cta-section";
import { Footer } from "~/components/layout/footer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Service Booking App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-freground">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
