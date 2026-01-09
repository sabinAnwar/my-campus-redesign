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
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return Response.json({ error: "Invalid token" }, { status: 400 });
    }

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        reset_token: token,
        reset_token_expiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return Response.json(
        { error: "Invalid or expired reset token", valid: false },
        { status: 400 }
      );
    }

    return Response.json({ success: true, valid: true });
  } catch (error) {
    console.error(" Error verifying reset token:", error);
    return Response.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
