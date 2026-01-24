import { redirect } from 'react-router';
import { getUser } from './auth';

export async function requireAuth(request: any) {
  const user = await getUser(request);

  if (!user) {
    throw redirect('/');
  }

  return user;
}

export async function requireStudent(request: any) {
  const user = await requireAuth(request);

  if (user.role !== 'STUDENT') {
    throw redirect('/');
  }

  return user;
}

export async function requireAdmin(request: any) {
  const user = await requireAuth(request);

  if (user.role !== 'ADMIN') {
    throw redirect('/');
  }

  return user;
}

export function redirectIfLoggedIn(user: any, redirectTo = '/') {
  if (user) {
    throw redirect(redirectTo);
  }
}