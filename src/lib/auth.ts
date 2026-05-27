'use server';

import { cookies } from 'next/headers';
import * as jose from 'jose';
import { callApi } from '@/lib/api';

export async function loginAction(username: string, password: string) {
  const result = await callApi<{ token: string; role: string }>('POST', '/auth/login', {
    username,
    password,
  });

  if (!result.success || !result.data) return false;

  const { token } = result.data;

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function portalSsoLoginAction(portalSsoToken: string) {
  const result = await callApi<{ token: string; role: string }>('POST', '/auth/portal-sso', {
    token: portalSsoToken,
  });

  if (!result.success || !result.data) return false;

  const { token } = result.data;

  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function logoutAction() {
  (await cookies()).delete('session');
}

export async function getSession() {
  const cookieObj = await cookies();
  const token = cookieObj.get('session')?.value;
  if (!token) return null;

  try {
    const payload = jose.decodeJwt(token);
    if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload; // { id, username, role }
  } catch {
    return null;
  }
}
