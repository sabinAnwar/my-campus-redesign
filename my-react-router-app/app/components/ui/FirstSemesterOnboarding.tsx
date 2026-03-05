import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, X } from "lucide-react";

interface FirstSemesterOnboardingProps {
  isOpen: boolean;
  steps: {
    id: string;
    selector: string;
    title: string;
    body: string;
  }[];
  onClose: () => void;
}

export default function FirstSemesterOnboarding({
  isOpen,
  steps,
  onClose,
}: FirstSemesterOnboardingProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const step = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    if (!isOpen) return;
    setStepIndex(0);
  }, [isOpen]);

  const updatePosition = useMemo(() => {
    return () => {
      if (!step) return;
      const target = document.querySelector(step.selector);
      if (!target) {
        setTargetRect(null);
        const tooltipHeight = tooltipRef.current?.offsetHeight ?? 220;
        const tooltipWidth = Math.min(360, window.innerWidth - 32);
        setViewport({ width: window.innerWidth, height: window.innerHeight });
        setTooltipStyle({
          top: Math.max(16, (window.innerHeight - tooltipHeight) / 2),
          left: Math.max(16, (window.innerWidth - tooltipWidth) / 2),
          width: tooltipWidth,
        });
        return;
      }

      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
      setViewport({ width: window.innerWidth, height: window.innerHeight });

      const tooltipHeight = tooltipRef.current?.offsetHeight ?? 220;
      const tooltipWidth = Math.min(360, window.innerWidth - 32);
      const padding = 16;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placeAbove = spaceBelow < tooltipHeight + 20;
      const top = placeAbove
        ? Math.max(padding, rect.top - tooltipHeight - 16)
        : Math.min(
            window.innerHeight - tooltipHeight - padding,
            rect.bottom + 12,
          );
      const left = Math.min(
        window.innerWidth - tooltipWidth - padding,
        Math.max(padding, rect.left),
      );

      setTooltipStyle({
        top,
        left,
        width: tooltipWidth,
      });
    };
  }, [step]);

  useEffect(() => {
    if (!isOpen || !step) return;
    const target = document.querySelector(step.selector);
    if (target && "scrollIntoView" in target) {
      (target as HTMLElement).scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
    updatePosition();

    const handleResize = () => updatePosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [isOpen, step, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight")
        setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      if (event.key === "ArrowLeft")
        setStepIndex((prev) => Math.max(prev - 1, 0));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, steps.length]);

  if (!isOpen || !step || steps.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[120] animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {targetRect ? (
        <div
          className="absolute rounded-2xl border-[3px] border-iu-blue shadow-[0_0_0_9999px_rgba(0,0,0,0.65),0_0_30px_rgba(59,130,246,0.5)] pointer-events-none transition-all duration-300"
          style={{
            top: Math.max(0, targetRect.top - 8),
            left: Math.max(0, targetRect.left - 8),
            width: Math.min(
              viewport.width || targetRect.width + 16,
              targetRect.width + 16,
            ),
            height: Math.min(
              viewport.height || targetRect.height + 16,
              targetRect.height + 16,
            ),
          }}
        />
      ) : null}

      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-semester-title"
        className="absolute rounded-[2rem] border border-iu-blue/20 bg-gradient-to-br from-card via-card to-card/95 text-card-foreground shadow-2xl overflow-hidden"
        style={tooltipStyle}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-iu-blue via-iu-purple to-iu-orange transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-iu-blue/20 to-iu-purple/20">
                <Sparkles className="h-4 w-4 text-iu-blue" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-iu-blue">
                Schritt {stepIndex + 1} von {steps.length}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all"
              aria-label="Schließen"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Title */}
          <h2
            id="first-semester-title"
            className="text-xl sm:text-2xl font-black text-foreground leading-tight"
          >
            {step.title}
          </h2>

          {/* Body */}
          <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
            {step.body}
          </p>

          {/* Step indicators */}
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setStepIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === stepIndex
                    ? "w-6 bg-gradient-to-r from-iu-blue to-iu-purple"
                    : idx < stepIndex
                      ? "w-2 bg-iu-blue/50"
                      : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Schritt ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </button>

            <button
              type="button"
              onClick={() =>
                stepIndex === steps.length - 1
                  ? onClose()
                  : setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
              }
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-iu-blue to-iu-purple px-5 py-2.5 text-xs font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-iu-blue/20"
            >
              <span>
                {stepIndex === steps.length - 1 ? "Los geht's! 🚀" : "Weiter"}
              </span>
              {stepIndex < steps.length - 1 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Skip link */}
          {stepIndex < steps.length - 1 && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Überspringen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
