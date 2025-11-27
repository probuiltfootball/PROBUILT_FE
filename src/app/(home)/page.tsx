import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import EdgeSection from "@/components/edge-section";
import HubSection from "@/components/hub-section";
import TeamSection from "@/components/team-section";
import TestimonialsSection from "@/components/testimonials-section";
import CtaSection from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="flex flex-col ">
      <Navbar />
      <HeroSection />
      <EdgeSection />
      <HubSection />
      <TeamSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
