import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import EdgeSection from "@/components/edge-section";
import HubSection from "@/components/hub-section";
import TeamSection from "@/components/team-section";
import TestimonialsSection from "@/components/testimonials-section";
import CtaSection from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Divider } from "@/components/divider";
import UpcomingSessions from "@/components/upcoming-sessions";
import TrainingSection from "@/components/training-section";
import PathSelection from "@/components/path-selection";
import WhyProbuilt from "@/components/why-probuilt";
import GuidedSession from "@/components/guided-session";
import Feedback from "@/components/feedback";

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
