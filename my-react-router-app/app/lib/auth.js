import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const SESSION_SECRET = process.env.SESSION_SECRET || 'default-secret-key';
const SESSION_NAME = 'auth_session';

// Simple in-memory session store (replace with a proper session store in production)
const sessions = new Map();

export async function createUserSession(userId) {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { userId });
  document.cookie = `${SESSION_NAME}=${sessionId}; path=/; samesite=lax; secure`;
  return sessionId;
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return user;
}

export async function logout() {
  try {
    console.log("🔓 Logout: Calling API...");
    const response = await fetch("/api/logout.data", {
      method: "POST",
      credentials: "include",
    });
    console.log("📡 Logout: Response status:", response.status);
    const data = await response.json();
    console.log("✅ Logout response:", data);
    
    // Clear cookies manually as backup
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    return data;
  } catch (err) {
    console.error("❌ Logout error:", err);
    // Clear cookies anyway
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    return null;
  }
}

export async function getCurrentSession() {
  const cookies = document.cookie.split('; ');
  const sessionCookie = cookies.find(cookie => cookie.startsWith(SESSION_NAME));
  if (!sessionCookie) return null;
  
  const sessionId = sessionCookie.split('=')[1];
  return sessions.get(sessionId);
}

export async function getUser() {
  const session = await getCurrentSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({ 
      where: { id: session.userId }
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function createPasswordResetToken(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const resetToken = crypto.randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  // Send email with reset link
  await sendPasswordResetEmail(email, resetToken);

  return resetToken;
}

export async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${process.env.APP_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;
  
  try {
    // Using a simple fetch to call an email service or API endpoint
    const response = await fetch(`${process.env.API_URL || 'http://localhost:5174'}/api/send-reset-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetLink, resetToken })
    });
    
    if (!response.ok) {
      console.error('Failed to send reset email');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending reset email:', error);
    // In development, we don't fail - the link is still shown
    return false;
  }
}

export async function validatePasswordResetToken(token) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  return user;
}