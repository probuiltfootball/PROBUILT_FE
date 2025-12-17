// Force dynamic rendering to prevent static generation
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#1a1a1a] to-[#2E2E2E]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#00FFC2] text-black rounded-lg font-semibold hover:bg-[#00E0AA] transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
