import React from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Globe,
  Bookmark,
  ChevronRight,
} from "lucide-react";

interface OpeningHoursItem {
  day: string;
  hours: string;
}

interface LibrarySidebarProps {
  t: any;
  language: "de" | "en";
  openingHours: OpeningHoursItem[];
}

export function LibrarySidebar({ t, language, openingHours }: LibrarySidebarProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Opening Hours */}
      <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="p-3 rounded-2xl bg-iu-blue/10">
            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t.openingHours}
          </h3>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {openingHours.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
            >
              <span className="text-sm text-muted-foreground font-black uppercase tracking-widest">
                {item.day}
              </span>
              <span
                className={`text-sm font-black ${item.hours === t.closed ? "text-iu-red" : "text-foreground"}`}
              >
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="p-3 rounded-2xl bg-iu-green/10">
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-iu-green" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t.askLibrarian}
          </h3>
        </div>

        <div className="space-y-4">
          <a
            href="mailto:bibliothek@iu.org"
            className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-iu-blue/10 transition-all duration-300"
          >
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Mail className="h-5 w-5 text-iu-blue" />
            </div>
            <span className="text-sm text-foreground font-black tracking-tight">
              bibliothek@iu.org
            </span>
          </a>
          <a
            href="tel:+4930123456789"
            className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-iu-blue/10 transition-all duration-300"
          >
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Phone className="h-5 w-5 text-iu-blue" />
            </div>
            <span className="text-sm text-foreground font-black tracking-tight">
              +49 30 123 456 789
            </span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 text-sm font-black text-iu-blue hover:text-iu-blue/80 transition-colors uppercase tracking-widest"
          >
            {language === "de" ? "Alle Kontaktmöglichkeiten" : "All contact options"}{" "}
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Location */}
      <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="p-3 rounded-2xl bg-iu-blue/10">
            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t.location}
          </h3>
        </div>

        <div className="rounded-3xl overflow-hidden bg-muted/50 h-40 mb-6 flex items-center justify-center border border-border/50 relative group">
          <div className="absolute inset-0 bg-iu-blue/5 group-hover:bg-iu-blue/10 transition-colors" />
          <Globe className="h-12 w-12 text-iu-blue/40 group-hover:scale-110 transition-transform duration-700" />
        </div>

        <p className="text-sm text-muted-foreground font-bold leading-relaxed">
          <span className="text-foreground font-black block mb-1">
            IU Campus Bibliothek
          </span>
          Juri-Gagarin-Ring 152
          <br />
          99084 Erfurt
        </p>
      </div>

      {/* My Library */}
      <div className="bg-gradient-to-br from-iu-blue to-iu-purple rounded-[2.5rem] p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Bookmark className="h-24 w-24 sm:h-32 sm:w-32" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Bookmark className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {t.myLibrary}
            </h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs group/btn">
              <span>{t.savedItems}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full group-hover/btn:bg-white group-hover/btn:text-iu-blue transition-colors">
                12
              </span>
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs group/btn">
              <span>{t.loanHistory}</span>
              <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs group/btn">
              <span>{t.reservations}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full group-hover/btn:bg-white group-hover/btn:text-iu-blue transition-colors">
                2
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
