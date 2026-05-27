export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    sameSite?: 'Strict' | 'Lax' | 'None';
    secure?: boolean;
  } = {}
): void {
  const { maxAge = 86400, path = '/', sameSite = 'Strict', secure = true } = options;
  let cookie = `${name}=${value}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;
  if (secure) cookie += '; Secure';
  document.cookie = cookie;
}

export function deleteCookie(name: string, path: string = '/'): void {
  document.cookie = `${name}=; path=${path}; max-age=0`;
}
