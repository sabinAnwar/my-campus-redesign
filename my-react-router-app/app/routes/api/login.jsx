import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function loader({ request }) {
  return handleLoginRequest(request);
}

export async function action({ request }) {
  return handleLoginRequest(request);
}

async function handleLoginRequest(request) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed. Use POST." },
      { status: 405 }
    );
  }

  try {
    let email, password;

    // Get content type from headers
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Parse as JSON
      try {
        const json = await request.json();
        email = json.email;
        password = json.password;
      } catch (jsonError) {
        console.error("❌ JSON parse error:", jsonError);
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse as form data
      try {
        const formData = await request.formData();
        email = formData.get("email");
        password = formData.get("password");
      } catch (formError) {
        console.error("❌ Form parse error:", formError);
        return Response.json({ error: "Invalid form data" }, { status: 400 });
      }
    } else {
      return Response.json(
        {
          error:
            "Content-Type must be application/json or application/x-www-form-urlencoded",
        },
        { status: 400 }
      );
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

    console.log("✅ Login successful for:", user.email);

    // Return success with session token
    const response = Response.json(
      {
        success: true,
        message: "Login successful!",
        user: { id: user.id, email: user.email, name: user.name },
        sessionToken: sessionToken,
      },
      {
        status: 200,
      }
    );

    // Set cookie with proper headers
    response.headers.set(
      "Set-Cookie",
      `session=${sessionToken}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax; HttpOnly`
    );

    console.log("🍪 Set-Cookie header set successfully");

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    console.error("❌ Stack:", error.stack);
    return Response.json(
      { error: "An error occurred during login", details: error.message },
      { status: 500 }
    );
  }
}

// Default export for React Router (not used, but required)
export default function LoginAPI() {
  return null;
}
