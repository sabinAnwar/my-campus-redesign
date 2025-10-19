import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function action({ request }) {
  // This action is NOT used in production
  // API calls go directly to Express at /api/login
  // This file exists for documentation purposes only
  
  return Response.json({
    error: "Please call the Express API at POST /api/login instead"
  }, { status: 404 });
}

export default function Login() {
  return null;
}
