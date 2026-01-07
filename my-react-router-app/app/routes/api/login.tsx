import bcryptjs from "bcryptjs";

import { prisma } from "~/lib/prisma";
import crypto from "crypto";

// Loader for GET requests (just blocks HTML)
export async function loader(): Promise<Response> {
  return Response.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}

// Action handles POST /api/login
export async function action({
  request,
}: {
  request: Request;
}): Promise<Response> {
  return handleLoginRequest(request);
}

async function handleLoginRequest(request: Request) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed. Use POST." },
      { status: 405 }
    );
  }

  try {
    let email: string | null = null;
    let password: string | null = null;

    // Be permissive with content types in production
    const contentType = request.headers.get("content-type") || "";
    console.log(" /api/login content-type:", contentType);

    // Try URL-encoded first (browser form default)
    try {
      if (
        contentType.includes("application/x-www-form-urlencoded") ||
        !contentType
      ) {
        const formData = await request.formData();
        const emailEntry = formData.get("email");
        const passwordEntry = formData.get("password");
        email = typeof emailEntry === "string" ? emailEntry : null;
        password = typeof passwordEntry === "string" ? passwordEntry : null;
      }
    } catch (formErr) {
      const message =
        formErr && typeof formErr === "object" && "message" in formErr
          ? (formErr as Error).message
          : String(formErr);
      console.warn(
        " formData parse failed, will try JSON:",
        message
      );
    }

    // If still missing, try JSON
    if (!email || !password) {
      try {
        const json: unknown = await request.json();
        if (typeof json === "object" && json !== null) {
          const obj = json as { email?: unknown; password?: unknown };
          if (!email && typeof obj.email === "string") {
            email = obj.email;
          }
          if (!password && typeof obj.password === "string") {
            password = obj.password;
          }
        }
      } catch (jsonErr) {
        // Ignore; will validate below
      }
    }

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email (case-insensitive)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create and store session in database
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Save session to database
    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    console.log(" Login successful for:", user.email);

    // Build cookie header
    const isProduction =
      process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
    let domain = null;
    try {
      if (process.env.COOKIE_DOMAIN) {
        const d = process.env.COOKIE_DOMAIN.trim();
        if (d.toLowerCase() === "host-only") {
          domain = null;
        } else {
          domain = d.startsWith(".") ? d : `.${d}`;
        }
      } else if (process.env.DISABLE_COOKIE_DOMAIN === "1") {
        domain = null;
      } else if (process.env.APP_URL) {
        const u = new URL(process.env.APP_URL);
        domain = u.hostname === "localhost" ? null : `.${u.hostname}`;
      }
    } catch (_) {}

    const parts = [
      `session=${sessionToken}`,
      "Path=/",
      `Max-Age=${7 * 24 * 60 * 60}`,
      "SameSite=Lax",
      "HttpOnly",
    ];
    if (isProduction) parts.push("Secure");
    if (domain) parts.push(`Domain=${domain}`);
    const cookieHeader = parts.join("; ");

    console.log(" Set-Cookie header:", cookieHeader);

    // Return success response with Set-Cookie header
    // Client will handle navigation
    const response = Response.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookieHeader);
    return response;
  } catch (error) {
    console.error(" Login error:", error);
    if (error instanceof Error) {
      console.error(" Stack:", error.stack);
    }
    return Response.json(
      { error: "An error occurred during login", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Default export for React Router (not used, but required)
export default function LoginAPI() {
  return null;
}
