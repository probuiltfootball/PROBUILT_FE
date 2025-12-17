import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PBPointsPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E] pt-44 md:pt-48 pb-20 top-hero-section px-4 min-h-175">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              ProBuilt Points
            </h1>
            <p className="text-xl text-gray-300">
              Earn points by completing training, challenges, and engaging with the
              community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-[#00FFC230]">
              <h2 className="text-2xl font-bold text-white mb-4">How to Earn Points</h2>
              <ul className="space-y-3 text-gray-300">
                <li>• Complete training modules</li>
                <li>• Finish challenges</li>
                <li>• Participate in community discussions</li>
                <li>• Upload and share videos</li>
                <li>• Achieve milestones</li>
              </ul>
            </div>

            <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-[#00FFC230]">
              <h2 className="text-2xl font-bold text-white mb-4">Redeem Points</h2>
              <ul className="space-y-3 text-gray-300">
                <li>• Unlock exclusive content</li>
                <li>• Get discounts on subscriptions</li>
                <li>• Access premium features</li>
                <li>• Win prizes and rewards</li>
                <li>• Join exclusive events</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#2E2E2E] rounded-xl p-8 border-2 border-[#00FFC230] text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
            <p className="text-gray-400 mb-6">
              Compete with other players and climb the leaderboard!
            </p>
            <div className="text-sm text-[#00FFC2] font-semibold">Coming Soon</div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
