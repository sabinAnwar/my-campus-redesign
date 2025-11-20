import React, { useEffect, useRef, useState } from "react";
import { Sun, Moon, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const icon = theme === "dark" ? Moon : Sun;
  const label = theme === "dark" ? "Dark" : "Light";

  const options: {
    key: "light" | "dark";
    label: string;
    description: string;
    Icon: typeof Sun;
  }[] = [
    {
      key: "light",
      label: "Light",
      description: "Bright UI, great for daytime",
      Icon: Sun,
    },
    {
      key: "dark",
      label: "Dark",
      description: "Dimmed UI for low light",
      Icon: Moon,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:-translate-y-0.5 transition-all"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {React.createElement(icon, { className: "h-4 w-4" })}
        <span className="hidden sm:inline">{label}</span>
        <ChevronDown className="h-3 w-3 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-popover p-2 text-xs shadow-2xl shadow-black/5 backdrop-blur-md"
          role="menu"
        >
          <div className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Theme
          </div>
          {options.map(({ key, label, description, Icon }) => {
            const active = theme === key;
            const descriptionClass = active
              ? "text-primary-foreground/80"
              : "text-muted-foreground";
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTheme(key);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground text-foreground"
                }`}
                role="menuitemradio"
                aria-checked={active}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                    active
                      ? "border-primary-foreground bg-primary-foreground text-primary"
                      : "border-border"
                  }`}
                >
                  {active && <Check className="h-3 w-3" />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        active
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs font-semibold">
                      {label}
                    </span>
                  </div>
                  <div className={`mt-0.5 text-[11px] ${descriptionClass}`}>
                    {description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
