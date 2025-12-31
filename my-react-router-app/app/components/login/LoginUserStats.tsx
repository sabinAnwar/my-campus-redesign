export const LoginUserStats = ({ total, online }: { total: number; online: number }) => (
  <div className="mt-8 text-center">
    <div className="inline-block">
      <p className="text-5xl font-black text-iu-blue drop-shadow-lg">{total}+</p>
      <p className="text-xs text-iu-blue font-semibold mt-2 uppercase tracking-wider">Active Dual Degree Students</p>
      <div className="mt-3 inline-flex items-center gap-2 bg-green-500/30 px-4 py-2 rounded-full border border-green-400/60 backdrop-blur-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-green-300 block animate-pulse" />
        <span className="text-xs text-green-100 font-bold">{online} Currently online</span>
      </div>
    </div>
  </div>
);
