import { PrismaClient } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

const prisma = new PrismaClient();

// Helper to get user from session
async function getUser(request: Request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  let sessionToken = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  if (!sessionToken) {
    sessionToken = request.headers.get("X-Session-Token");
  }

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || new Date() > session.expiresAt) return null;
  return session.user;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get("courseId");

  if (!courseId) {
    return Response.json({ error: "Course ID required" }, { status: 400 });
  }

  try {
    // Note: This might fail if schema is not pushed yet
    const topics = await prisma.forumTopic.findMany({
      where: { courseId: Number(courseId) },
      include: {
        author: { select: { name: true } },
        posts: {
          include: {
            author: { select: { name: true } }
          }
        }
      },
      orderBy: [
        { pinned: 'desc' },
        { updatedAt: 'desc' }
      ]
    });

    const formattedTopics = topics.map(topic => ({
      id: topic.id,
      title: topic.title,
      author: topic.author.name || "Unknown",
      replies: topic.posts.length,
      views: topic.views,
      lastPost: topic.updatedAt.toLocaleDateString("de-DE"),
      status: topic.pinned ? "pinned" : "active",
      content: topic.content,
      posts: topic.posts.map(post => ({
        id: post.id,
        author: post.author.name || "Unknown",
        content: post.content,
        timestamp: post.createdAt.toLocaleString("de-DE"),
        likes: post.likes
      }))
    }));

    return Response.json({ topics: formattedTopics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    // Return empty array if DB fails (e.g. schema mismatch) so frontend doesn't crash
    return Response.json({ topics: [] });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await getUser(request);

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  if (request.method === "POST") {
    const { courseId, title, content } = data;
    
    try {
      if (courseId === undefined || courseId === null || !title || !content) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }

      const topic = await prisma.forumTopic.create({
        data: {
          courseId: Number(courseId),
          title,
          content,
          author: {
            connect: { id: Number(user.id) },
          },
        },
        include: {
          author: { select: { name: true } },
        },
      });

      return Response.json({ 
        topic: {
          id: topic.id,
          title: topic.title,
          author: topic.author?.name || "Unknown",
          replies: 0,
          views: 0,
          lastPost: topic.createdAt.toLocaleDateString("de-DE"),
          status: "active",
          content: topic.content,
          posts: []
        }
      });
    } catch (error) {
      console.error("Error creating topic:", error);
      return Response.json({ error: "Failed to create topic" }, { status: 500 });
    }
  }

  if (request.method === "PUT") {
    const { topicId, action } = data;
    
    if (action === "view" && topicId) {
      try {
        // Check if user already viewed this topic
        const existingView = await prisma.forumTopicView.findUnique({
          where: {
            topicId_userId: {
              topicId: String(topicId),
              userId: user.id
            }
          }
        });

        if (!existingView) {
          // Create view record and increment count
          await prisma.$transaction([
            prisma.forumTopicView.create({
              data: {
                topicId: String(topicId),
                userId: user.id
              }
            }),
            prisma.forumTopic.update({
              where: { id: String(topicId) },
              data: { views: { increment: 1 } }
            })
          ]);
        }
        
        return Response.json({ success: true });
      } catch (error) {
        console.error("Error updating view:", error);
        return Response.json({ error: "Failed to update view" }, { status: 500 });
      }
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
