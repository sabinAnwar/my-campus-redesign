import { MapPin } from "lucide-react";

export const LoginCampusLocations = () => (
  <div className="login-campus-grid">
    <div className="login-campus-card group cursor-pointer transform hover:scale-110 transition-transform">
      <div className="p-3 rounded-lg bg-iu-blue border-2 border-white/20 hover:bg-iu-blue hover:border-white/40 transition-all flex flex-col items-center">
        <MapPin className="w-6 h-6 text-white mb-1 drop-shadow-lg" />
        <p className="text-xs font-bold text-white drop-shadow-lg text-center">Christoph-Probst-Weg</p>
        <p className="text-xs text-white drop-shadow-md">Hamburg</p>
      </div>
    </div>
  </div>
);
