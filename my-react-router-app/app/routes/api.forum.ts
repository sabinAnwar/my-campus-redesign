import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/lib/prisma";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const courseId = url.searchParams.get("courseId");

  if (!courseId) {
    return json({ error: "courseId is required" }, { status: 400 });
  }

  const topics = await prisma.forumTopic.findMany({
    where: { courseId: Number(courseId) },
    orderBy: [
        { pinned: "desc" },
        { updatedAt: "desc" }
    ],
    include: {
      author: {
        select: { name: true }
      },
      posts: {
        orderBy: { createdAt: "asc" },
        include: {
          author: {
            select: { name: true }
          }
        }
      }
    }
  });

  // Map to the format the frontend expects
  const formattedTopics = topics.map(topic => ({
    id: topic.id,
    title: topic.title,
    content: topic.content,
    author: topic.author.name || "Unknown",
    lastPost: topic.posts.length > 0 
      ? new Date(topic.posts[topic.posts.length - 1].createdAt).toLocaleDateString("de-DE")
      : new Date(topic.updatedAt).toLocaleDateString("de-DE"),
    replies: topic.posts.length,
    status: topic.pinned ? "pinned" : "normal",
    posts: topic.posts.map(post => ({
      id: post.id,
      author: post.author.name || "Unknown",
      content: post.content,
      date: new Date(post.createdAt).toLocaleDateString("de-DE"),
      likes: post.likes
    }))
  }));

  return json({ topics: formattedTopics });
};

export const action = async ({ request }: ActionFunctionArgs) => {
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

  if (request.method === "POST") {
    const { courseId, title, content } = await request.json();

    if (!courseId || !title || !content) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const topic = await prisma.forumTopic.create({
      data: {
        courseId: Number(courseId),
        title,
        content,
        authorId: user.id,
      },
      include: {
        author: {
            select: { name: true }
        }
      }
    });

    return json({
      topic: {
        id: topic.id,
        title: topic.title,
        content: topic.content,
        author: topic.author.name || "Unknown",
        lastPost: new Date(topic.createdAt).toLocaleDateString("de-DE"),
        replies: 0,
        status: "normal",
        posts: []
      }
    });
  }

  if (request.method === "PUT") {
    const { topicId, action: topicAction } = await request.json();

    if (topicAction === "view") {
        await prisma.forumTopic.update({
            where: { id: Number(topicId) },
            data: { views: { increment: 1 } }
        });
        return json({ success: true });
    }
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
