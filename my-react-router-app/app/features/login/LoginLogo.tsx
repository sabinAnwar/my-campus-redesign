import { memo } from "react";

export const LoginLogo = memo(() => (
  <div className="mb-8 flex justify-center">
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-iu-blue via-purple-500 to-orange-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 animate-pulse transition-opacity duration-500" />
      <div className="absolute inset-0 bg-iu-blue/40 rounded-2xl blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="relative h-24 w-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20 hover:border-iu-blue/50 transition-all duration-300 hover:scale-105 group-hover:shadow-iu-blue/50">
        <span className="text-4xl font-black bg-gradient-to-r from-iu-blue via-white to-orange-400 bg-clip-text text-transparent drop-shadow-lg">IU</span>
      </div>
    </div>
  </div>
));
LoginLogo.displayName = "LoginLogo";
