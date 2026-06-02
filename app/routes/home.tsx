import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Navbar } from "~/components/layout/navbar";
import { HeroSection } from "~/components/landing/hero-section";
import { ServicesSection } from "~/components/landing/service-section";
import { WhyChooseUsSection } from "~/components/landing/why-choose-use-section";
import { TestimonialsSection } from "~/components/landing/testimonials-section";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
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
    </main>
  )
}
