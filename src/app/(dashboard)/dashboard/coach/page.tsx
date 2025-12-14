export default function CoachDashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2E2E2E]">
      <div className="text-center px-4">
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-2">
            Coach Dashboard
          </p>
          <p className="text-gray-400 max-w-md mx-auto">
            We're working on building an amazing coaching experience for you. 
            This feature will be available in a future update.
          </p>
        </div>
        <div className="mt-8">
          <div className="inline-block animate-pulse">
            <div className="w-16 h-16 border-4 border-[#00FFC2] border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

