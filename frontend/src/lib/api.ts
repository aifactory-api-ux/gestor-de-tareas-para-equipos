const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

interface ApiFetchOptions extends RequestInit {
  params?: Record<string, string>;
}

function buildUrl(path: string, params?: Record<string, string>): string {
  if (!params) return path;
  const searchParams = new URLSearchParams(params);
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: ApiFetchOptions
): Promise<T> {
  const { params, ...fetchOptions } = options || {};
  const url = buildUrl(path, params);

  const token = localStorage.getItem(TOKEN_KEY);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USUARIO_KEY);
      window.location.href = '/login';
    }
    throw new Error(errorText || `HTTP error ${res.status}`);
  }

  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json() as Promise<T>;
  }

  return res.text() as unknown as T;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUsuario<T>(): T | null {
  const stored = localStorage.getItem(USUARIO_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return null;
  }
}

export function setStoredUsuario(usuario: unknown): void {
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}
