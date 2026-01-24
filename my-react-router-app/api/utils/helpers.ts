import { type Request, type CookieOptions } from "express";

// Small helper: get session token from cookie or header, accept both legacy and new names
export function getSessionToken(req: Request): string | null {
  const cookieToken = req.cookies?.session || req.cookies?.auth_session || null;
  const headerToken =
    req.get("X-Session-Token") || req.get("x-session-token") || null;
  return cookieToken || headerToken || null;
}

// Get current hour in a specific IANA timezone (0-23)
export function getHourInTimezone(tz: string | null | undefined): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hour12: false,
      timeZone: tz || "Europe/Berlin",
    });
    const parts = fmt.formatToParts(new Date());
    const hourStr = parts.find((p) => p.type === "hour")?.value || "00";
    return Number(hourStr);
  } catch (_) {
    return new Date().getUTCHours();
  }
}

// Get current minute in a specific IANA timezone (0-59)
export function getMinuteInTimezone(tz: string | null | undefined): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      minute: "2-digit",
      hour12: false,
      timeZone: tz || "Europe/Berlin",
    });
    const parts = fmt.formatToParts(new Date());
    const minStr = parts.find((p) => p.type === "minute")?.value || "00";
    return Number(minStr);
  } catch (_) {
    return new Date().getUTCMinutes();
  }
}

export function getCookieOptions(req: Request): CookieOptions {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  let domain;
  try {
    // Priority 1: explicit override
    if (process.env.COOKIE_DOMAIN) {
      const d = process.env.COOKIE_DOMAIN.trim();
      if (d.toLowerCase() === "host-only") {
        domain = undefined; // force host-only cookie
      } else {
        domain = d.startsWith(".") ? d : `.${d}`;
      }
    } else if (process.env.DISABLE_COOKIE_DOMAIN === "1") {
      domain = undefined;
    } else if (process.env.APP_URL) {
      const u = new URL(process.env.APP_URL);
      domain = u.hostname === "localhost" ? undefined : `.${u.hostname}`;
    }
  } catch (_) {
    domain = undefined;
  }
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    domain,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

// Helper to safely parse ints with default
export function toInt(value: unknown, def: number): number {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}
