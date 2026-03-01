export const LoginUserStats = ({ total, online }: { total: number; online: number }) => (
  <div className="mt-2 text-center">
    <div className="inline-block">
      <p className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg">{total}+</p>
      <p className="text-[10px] sm:text-xs text-white font-semibold mt-1 uppercase tracking-wider">Active Dual Degree Students</p>
      <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-900/80 px-3 py-1.5 rounded-full border border-emerald-400/60">
        <span className="h-2 w-2 rounded-full bg-emerald-200 block animate-pulse" />
        <span className="text-[10px] sm:text-xs text-emerald-100 font-bold">{online} Currently online</span>
      </div>
    </div>
  </div>
);
