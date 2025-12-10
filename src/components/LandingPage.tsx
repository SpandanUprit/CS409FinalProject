export function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-3xl px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-black to-blue-600/30" />
      <div className="relative max-w-3xl w-full text-center space-y-8 border border-white/10 rounded-3xl bg-black/50 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="space-y-4">
          <p className="uppercase tracking-[0.5em] text-xs text-purple-300/80">Slow cinema mode</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-white">Movielationships</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Take a breath. This is your quiet corner of the internet to rediscover films, reflect on what you love, and let carefully curated recommendations find you.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onEnter}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-12 py-4 text-lg font-semibold text-white shadow-[0_20px_50px_rgba(59,130,246,0.45)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Continue browsing
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
