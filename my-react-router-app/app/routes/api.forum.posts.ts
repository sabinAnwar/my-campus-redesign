import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/prisma";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const cookieHeader = request.headers.get("Cookie");
  const xSessionToken = request.headers.get("X-Session-Token");
  
  const sessionToken = xSessionToken || cookieHeader?.split("session=")[1]?.split(";")[0];

  let user = await prisma.session
    .findFirst({
      where: { token: sessionToken || "" },
      include: { user: true },
    })
    .then((s: any) => s?.user);

  // Fallback for dev if no session
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "student.demo@iu-study.org" },
    });
  }

  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { topicId, content } = await request.json();

  if (!topicId || !content) {
    return json({ error: "Missing topicId or content" }, { status: 400 });
  }

  const post = await prisma.forumPost.create({
    data: {
      topicId: Number(topicId),
      content,
      authorId: user.id
    },
    include: {
      author: {
        select: { name: true }
      }
    }
  });

  // Update the topic's updatedAt timestamp
  await prisma.forumTopic.update({
    where: { id: Number(topicId) },
    data: { updatedAt: new Date() }
  });

  return json({
    post: {
      id: post.id,
      author: post.author.name || "Unknown",
      content: post.content,
      date: new Date(post.createdAt).toLocaleDateString("de-DE"),
      likes: post.likes
    }
  });
};
