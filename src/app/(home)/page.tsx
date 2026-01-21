import Navbar from "@/components/navbar";
import HeroSection from "@/components/landing-page/hero-section";
import EdgeSection from "@/components/landing-page/edge-section";
import HubSection from "@/components/landing-page/hub-section";
import TeamSection from "@/components/landing-page/team-section";
import TestimonialsSection from "@/components/landing-page/testimonials-section";
import CtaSection from "@/components/landing-page/cta-section";
import { Footer } from "@/components/footer";
import { Divider } from "@/components/ui/divider";
import UpcomingSessions from "@/components/landing-page/upcoming-sessions";
import TrainingSection from "@/components/landing-page/training-section";
import PathSelection from "@/components/landing-page/path-selection";
import WhyProbuilt from "@/components/landing-page/why-probuilt";
import GuidedSession from "@/components/landing-page/guided-session";
import Feedback from "@/components/landing-page/feedback";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <HeroSection />
      <Divider />
      <WhyProbuilt />
      <Divider />
      <GuidedSession />
      <Divider />
      <Feedback />
      <Divider />
      <PathSelection />
      <Footer />
    </main>
  );
}
