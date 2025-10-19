import { redirect } from 'react-router';
import { getUser } from './auth';

export async function requireAuth(request) {
  const user = await getUser(request);

  if (!user) {
    throw redirect('/login');
  }

  return user;
}

export async function requireStudent(request) {
  const user = await requireAuth(request);

  if (user.role !== 'STUDENT') {
    throw redirect('/');
  }

  return user;
}

export async function requireAdmin(request) {
  const user = await requireAuth(request);

  if (user.role !== 'ADMIN') {
    throw redirect('/');
  }

  return user;
}

export function redirectIfLoggedIn(user, redirectTo = '/') {
  if (user) {
    throw redirect(redirectTo);
  }
}