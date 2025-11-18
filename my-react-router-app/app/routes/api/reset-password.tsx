import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function action({
  request,
}: {
  request: Request;
}): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { token, password } = await request.json();

    console.log(
      "📝 Password reset attempt with token:",
      token?.substring(0, 8) + "..."
    );

    if (!token || typeof token !== "string") {
      return Response.json({ error: "Invalid token" }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return Response.json(
        { error: "Please provide a new password" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid or expired reset token", success: false },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log("✅ Password reset successfully for user:", user.email);

    return Response.json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    return Response.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
