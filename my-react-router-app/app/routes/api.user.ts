import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/lib/prisma";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const xSessionToken = request.headers.get("X-Session-Token");
  
  const sessionToken = xSessionToken || cookieHeader?.split("session=")[1]?.split(";")[0];

  let user = await prisma.session
    .findFirst({
      where: { token: sessionToken || "" },
      include: { 
        user: {
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                username: true
            }
        } 
      },
    })
    .then((s: any) => s?.user);

  // Fallback for demo
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "student.demo@iu-study.org" },
      select: {
          id: true,
          name: true,
          email: true,
          role: true,
          username: true
      }
    });
  }

  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  return json({ user });
};
