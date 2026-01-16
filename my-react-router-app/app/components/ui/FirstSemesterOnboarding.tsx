import React, { useEffect, useMemo, useRef, useState } from "react";

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
        : Math.min(window.innerHeight - tooltipHeight - padding, rect.bottom + 12);
      const left = Math.min(
        window.innerWidth - tooltipWidth - padding,
        Math.max(padding, rect.left)
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
      (target as HTMLElement).scrollIntoView({ block: "center", behavior: "smooth" });
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
      if (event.key === "ArrowRight") setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
      if (event.key === "ArrowLeft") setStepIndex((prev) => Math.max(prev - 1, 0));
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
          className="absolute rounded-xl border-2 border-iu-blue/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{
            top: Math.max(0, targetRect.top - 6),
            left: Math.max(0, targetRect.left - 6),
            width: Math.min(viewport.width || targetRect.width + 12, targetRect.width + 12),
            height: Math.min(viewport.height || targetRect.height + 12, targetRect.height + 12),
          }}
        />
      ) : null}

      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-semester-title"
        className="absolute rounded-[1.5rem] border border-iu-blue/30 bg-card text-card-foreground shadow-2xl p-5 sm:p-6"
        style={tooltipStyle}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>
        <h2 id="first-semester-title" className="mt-2 text-lg sm:text-xl font-black text-foreground">
          {step.title}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          {step.body}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={stepIndex === 0}
            className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              stepIndex === steps.length - 1
                ? onClose()
                : setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
            }
            className="inline-flex items-center justify-center rounded-full bg-iu-blue px-5 py-2 text-xs font-bold text-white hover:bg-iu-blue/90 transition-colors"
          >
            {stepIndex === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
