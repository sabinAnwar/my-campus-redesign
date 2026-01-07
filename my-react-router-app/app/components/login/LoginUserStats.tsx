export const LoginUserStats = ({ total, online }: { total: number; online: number }) => (
  <div className="mt-8 text-center">
    <div className="inline-block">
      <p className="text-5xl font-black text-white drop-shadow-lg">{total}+</p>
      <p className="text-xs text-white/85 font-semibold mt-2 uppercase tracking-wider">Active Dual Degree Students</p>
      <div className="mt-3 inline-flex items-center gap-2 bg-emerald-900/80 px-4 py-2 rounded-full border border-emerald-400/60">
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-200 block animate-pulse" />
        <span className="text-xs text-emerald-100 font-bold">{online} Currently online</span>
      </div>
    </div>
  </div>
);
