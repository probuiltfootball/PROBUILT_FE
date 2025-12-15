import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import MembershipPlans from "@/components/membership/MembershipPlans";

export default function MembershipPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-44 md:pt-48">
        <MembershipPlans />
      </div>
      <Footer />
    </main>
  );
}

