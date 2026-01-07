import { MOTIVATIONAL_QUOTES } from "~/data/quotes";

const VISIBLE_QUOTE_DOTS = 10;

export const LoginQuoteSection = ({ currentQuote, isFading, onDotClick, activeIndex }: any) => (
  <div className="mb-8 sm:mb-12">
    <div className={`group cursor-pointer transform hover:-translate-y-1 transition-all duration-500 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="flex flex-col p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-iu-blue/35 via-slate-950/90 to-iu-orange/35 border-2 border-white/25 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 backdrop-blur-md">
        <div className="text-3xl sm:text-5xl text-white/90 mb-3 leading-none drop-shadow-2xl">"</div>
        <p className="text-base sm:text-lg font-bold text-white mb-3 leading-relaxed drop-shadow-lg">{currentQuote.quote_de}</p>
        <div className="w-16 h-0.5 bg-gradient-to-r from-white/80 to-white/40 mx-auto mb-3 rounded-full" />
        <p className="text-xs sm:text-sm text-white/80 italic mb-4 leading-relaxed drop-shadow-md">"{currentQuote.quote_en}"</p>
        <p className="text-xs text-white/85 font-semibold drop-shadow-md">— {currentQuote.author}</p>
      </div>
    </div>
    <div className="flex justify-center gap-1.5 mt-4">
      {MOTIVATIONAL_QUOTES.slice(0, VISIBLE_QUOTE_DOTS).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onDotClick(idx)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex % VISIBLE_QUOTE_DOTS ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
          aria-label={`Zitat ${idx + 1}`}
        />
      ))}
      <span className="text-white/80 text-xs ml-2">+{MOTIVATIONAL_QUOTES.length - VISIBLE_QUOTE_DOTS}</span>
    </div>
  </div>
);
