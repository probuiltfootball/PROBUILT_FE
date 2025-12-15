import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function CommunityPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E] pt-44 md:pt-48 pb-20 top-hero-section px-4 min-h-[700px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              ProBuilt Community
            </h1>
            <p className="text-xl text-gray-300">
              Connect with players, coaches, and football enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Coming Soon Cards */}
            <div className="bg-[#2E2E2E] rounded-xl p-6 border-2 border-[#00FFC230]">
              <h2 className="text-2xl font-bold text-white mb-4">Forums</h2>
              <p className="text-gray-400 mb-4">
                Join discussions, ask questions, and share your experiences with the community.
              </p>
              <div className="text-sm text-[#00FFC2] font-semibold">Coming Soon</div>
            </div>

            <div className="bg-[#2E2E2E] rounded-xl p-6 border-2 border-[#00FFC230]">
              <h2 className="text-2xl font-bold text-white mb-4">Groups</h2>
              <p className="text-gray-400 mb-4">
                Join groups based on your position, skill level, or interests.
              </p>
              <div className="text-sm text-[#00FFC2] font-semibold">Coming Soon</div>
            </div>

            <div className="bg-[#2E2E2E] rounded-xl p-6 border-2 border-[#00FFC230]">
              <h2 className="text-2xl font-bold text-white mb-4">Events</h2>
              <p className="text-gray-400 mb-4">
                Participate in community events, challenges, and meetups.
              </p>
              <div className="text-sm text-[#00FFC2] font-semibold">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

