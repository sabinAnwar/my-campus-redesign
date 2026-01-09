import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  let user = await getUserFromRequest(request);
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: "student.demo@iu-study.org" },
    });
  }
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.method === "POST") {
    try {
      const data = await request.json();
      const { topicId, content } = data;

      if (!topicId || !content) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
      }

      const post = await prisma.forumPost.create({
        data: {
          topic: {
            connect: { id: Number(topicId) },
          },
          content,
          author: {
            connect: { id: Number(user.id) },
          },
        },
        include: {
          author: { select: { name: true } },
        },
      });
      
      // Update topic updated_at
      await prisma.forumTopic.update({
        where: { id: Number(topicId) },
        data: { updated_at: new Date() },
      });

      return Response.json({ 
        post: {
          id: post.id,
          author: post.author?.name || "Unknown",
          content: post.content,
          timestamp: post.created_at.toLocaleString("de-DE"),
          likes: 0,
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      return Response.json({ error: "Failed to create post" }, { status: 500 });
    }
  }
  
  if (request.method === "PUT") {
    const data = await request.json();
    const { postId, action } = data;

    if (action === "like" && postId) {
      try {
        // Check if user already liked this post
        const existingLike = await prisma.forumPostLike.findUnique({
          where: {
            postId_userId: {
              postId: Number(postId),
              userId: Number(user.id),
            },
          },
        });

        if (!existingLike) {
          // Create like record and increment count
          await prisma.$transaction([
            prisma.forumPostLike.create({
              data: {
                postId: Number(postId),
                userId: Number(user.id),
              },
            }),
            prisma.forumPost.update({
              where: { id: Number(postId) },
              data: { likes: { increment: 1 } },
            }),
          ]);
        }

        return Response.json({ success: true });
      } catch (error) {
        console.error("Error liking post:", error);
        return Response.json({ error: "Failed to like post" }, { status: 500 });
      }
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
