import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import MembershipPlans from "@/components/membership/MembershipPlans";
import MembershipPlansUpdated from "@/components/membership/MembershipPlansUpdated";

export default function MembershipPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div>
        <MembershipPlansUpdated />
      </div>
      <Footer />
    </main>
  );
}
