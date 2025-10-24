import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function action({ request }) {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    let email, password;

    // Try to parse as form data
    try {
      const formData = await request.formData();
      email = formData.get("email");
      password = formData.get("password");
    } catch (formError) {
      // Fallback: try to parse as JSON
      try {
        const json = await request.json();
        email = json.email;
        password = json.password;
      } catch (jsonError) {
        return Response.json(
          { error: "Could not parse request body" },
          { status: 400 }
        );
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

    console.log("✅ Login successful for:", user.email);

    // Return success with session token
    return Response.json(
      {
        success: true,
        message: "Login successful!",
        user: { id: user.id, email: user.email, name: user.name },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `session=${sessionToken}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; SameSite=Lax`,
        },
      }
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    return Response.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
