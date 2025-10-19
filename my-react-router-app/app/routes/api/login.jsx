import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function action({ request }) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Get form data from the request
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || typeof email !== 'string') {
      return Response.json({ id: `${Date.now()}`, error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return Response.json({ id: `${Date.now()}`, error: 'Please provide a password' }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return Response.json({ id: `${Date.now()}`, error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return Response.json({ id: `${Date.now()}`, error: 'Invalid email or password' }, { status: 401 });
    }

    // Create session cookie
    const sessionId = crypto.randomUUID();
    
    const response = Response.json({ 
      id: `${Date.now()}`,
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      }
    });

    // Set secure cookie
    response.headers.set('Set-Cookie', `auth_session=${sessionId}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return Response.json({ id: `${Date.now()}`, error: 'Failed to process login' }, { status: 500 });
  }
}

export default function Login() {
  return null;
}
