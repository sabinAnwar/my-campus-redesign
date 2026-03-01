import { MOTIVATIONAL_QUOTES } from "~/data/quotes";

const VISIBLE_QUOTE_DOTS = 10;

export const LoginQuoteSection = ({ currentQuote, isFading, onDotClick, activeIndex }: any) => (
  <div className="mb-4 sm:mb-6">
    <div className={`group cursor-pointer transform hover:-translate-y-1 transition-all duration-500 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="flex flex-col p-3 sm:p-5 rounded-2xl bg-gradient-to-br from-iu-blue/35 via-slate-950/90 to-iu-orange/35 border-2 border-white/25 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 backdrop-blur-md">
        <div className="text-2xl sm:text-4xl text-white mb-1.5 leading-none drop-shadow-2xl">"</div>
        <p className="text-sm sm:text-base font-bold text-white mb-2 leading-snug drop-shadow-lg">{currentQuote.quote_de}</p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-white/80 to-white/40 mx-auto mb-2 rounded-full" />
        <p className="text-[10px] sm:text-xs text-white italic mb-2 leading-relaxed drop-shadow-md">"{currentQuote.quote_en}"</p>
        <p className="text-[9px] sm:text-[10px] text-white font-semibold drop-shadow-md">— {currentQuote.author}</p>
      </div>
    </div>
    <div className="flex items-center justify-center gap-1 mt-3">
      {MOTIVATIONAL_QUOTES.slice(0, VISIBLE_QUOTE_DOTS).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onDotClick(idx)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex % VISIBLE_QUOTE_DOTS ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
          aria-label={`Zitat ${idx + 1}`}
        />
      ))}
      <span className="text-white text-xs leading-none ml-2">+{MOTIVATIONAL_QUOTES.length - VISIBLE_QUOTE_DOTS}</span>
    </div>
  </div>
);
