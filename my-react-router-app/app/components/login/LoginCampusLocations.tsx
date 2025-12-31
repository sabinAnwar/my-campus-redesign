import { MapPin } from "lucide-react";

export const LoginCampusLocations = () => (
  <div className="login-campus-grid">
    <div className="group cursor-pointer transform hover:scale-110 transition-transform">
      <div className="p-3 rounded-lg bg-iu-blue/35 border-2 border-iu-blue/70 hover:bg-iu-blue/45 hover:border-iu-blue transition-all backdrop-blur-md flex flex-col items-center">
        <MapPin className="w-6 h-6 text-iu-blue mb-1 drop-shadow-lg" />
        <p className="text-xs font-bold text-white drop-shadow-lg text-center">Hammerbrook</p>
        <p className="text-xs text-iu-blue drop-shadow-md">Hamburg</p>
      </div>
    </div>
    <div className="group cursor-pointer transform hover:scale-110 transition-transform">
      <div className="p-3 rounded-lg bg-orange-500/35 border-2 border-orange-400/70 hover:bg-orange-500/45 hover:border-orange-300 transition-all backdrop-blur-md flex flex-col items-center">
        <MapPin className="w-6 h-6 text-orange-200 mb-1 drop-shadow-lg" />
        <p className="text-xs font-bold text-white drop-shadow-lg text-center">Waterloohain</p>
        <p className="text-xs text-orange-100 drop-shadow-md">Hamburg</p>
      </div>
    </div>
  </div>
);
