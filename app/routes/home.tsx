import type { Route } from "./+types/home";
import { HeroSection } from "~/features/landing/components/hero-section";
import { ServicesSection } from "~/features/landing/components/service-section";
import { WhyChooseUsSection } from "~/features/landing/components/why-choose-use-section";
import { TestimonialsSection } from "~/features/landing/components/testimonials-section";
import { CTASection } from "~/features/landing/components/cta-section";
import { Footer } from "~/components/layout/footer";
import { PublicLayout } from "~/components/layout/public-layout";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Service Booking App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <PublicLayout>
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CTASection />
    </PublicLayout>
  )
}
