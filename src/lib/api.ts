const DEFAULT_API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    : 'http://localhost:4000/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
type BodyData = FormData | object | undefined;

type CallApiOptions = RequestInit & {
  showError?: boolean;
  showSuccess?: boolean;
  errorMessage?: string;
};

export interface BaseResponse<T = unknown> {
  data: T | null;
  success: boolean;
  message: string | null | undefined;
  messageCode: string | null | undefined;
  dateNow: string | null | undefined;
}

export type ApiResult<T> = BaseResponse<T>;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

function withLeadingSlash(path: string) {
  return path.startsWith('/') ? path : `/${path}`;
}

const publicApiUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);
const apiUrl = trimTrailingSlash(
  typeof window === 'undefined' ? process.env.API_URL || publicApiUrl : '/api/backend'
);

export const API_CONFIG = {
  apiUrl,
  apiOrigin: /^https?:\/\//i.test(apiUrl)
    ? apiUrl.replace(/\/api\/?$/, '')
    : publicApiUrl.replace(/\/api\/?$/, ''),
  publicApiUrl,
  publicApiOrigin: publicApiUrl.replace(/\/api\/?$/, ''),
  socketUrl: trimTrailingSlash(
    process.env.NEXT_PUBLIC_SOCKET_URL || publicApiUrl.replace(/\/api\/?$/, '')
  ),
};

export function apiAssetUrl(path: string) {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${API_CONFIG.publicApiOrigin}${withLeadingSlash(path)}`;
}

function endpointUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${API_CONFIG.apiUrl}${withLeadingSlash(endpoint)}`;
}

async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json().catch(() => null);
  }
  return res.text().catch(() => '');
}

async function notify(type: 'success' | 'error', message?: string) {
  if (typeof window === 'undefined' || !message) return;
  const { toast } = await import('react-hot-toast');
  toast[type](message);
}

function isBaseResponse<T>(payload: unknown): payload is BaseResponse<T> {
  return Boolean(
    payload && typeof payload === 'object' && 'success' in payload && 'data' in payload
  );
}

function requestInit(method: HttpMethod, data?: BodyData, options?: CallApiOptions): RequestInit {
  const init = { ...(options || {}) } as RequestInit & {
    showError?: boolean;
    showSuccess?: boolean;
    errorMessage?: string;
  };
  const headers = new Headers(init.headers);
  delete init.showError;
  delete init.showSuccess;
  delete init.errorMessage;
  delete init.headers;

  if (data instanceof FormData) {
    return { ...init, method, headers, body: data };
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return {
    ...init,
    method,
    headers,
    body: data === undefined || method === 'GET' ? undefined : JSON.stringify(data),
  };
}

export async function callApi<T>(
  method: HttpMethod,
  endpoint: string,
  data?: BodyData,
  options?: CallApiOptions
): Promise<ApiResult<T>> {
  const showError = options?.showError ?? true;
  const showSuccess = options?.showSuccess ?? method !== 'GET';
  try {
    const res = await fetch(endpointUrl(endpoint), requestInit(method, data, options));
    const payload = await parseResponse(res);
    const basePayload = isBaseResponse<T>(payload) ? payload : null;
    const success = basePayload ? basePayload.success : res.ok;
    const responseData = basePayload ? basePayload.data : payload;
    const responseMessage = basePayload?.message || payload?.message || payload?.error || null;
    const responseCode = basePayload?.messageCode || payload?.code || null;

    if (!res.ok || !success) {
      const result = {
        data: null,
        success: false,
        message: responseMessage || options?.errorMessage || `API request failed (${res.status})`,
        messageCode: responseCode || String(res.status),
        dateNow: basePayload?.dateNow,
      } as const;
      if (showError) await notify('error', result.message);
      if (
        typeof window !== 'undefined' &&
        result.messageCode === '401' &&
        !endpoint.includes('/auth/login')
      ) {
        window.location.href = '/login';
      }
      return result;
    }

    const result = {
      data: responseData as T,
      success: true,
      message: responseMessage,
      messageCode: responseCode,
      dateNow: basePayload?.dateNow,
    } as const;
    if (showSuccess && responseMessage) {
      await notify('success', responseMessage);
    }
    return result;
  } catch (error: unknown) {
    const result = {
      data: null,
      success: false,
      message:
        options?.errorMessage ||
        (error instanceof Error ? error.message : 'เชื่อมต่อ API ไม่สำเร็จ'),
      messageCode: 'NETWORK_ERROR',
      dateNow: new Date().toISOString(),
    } as const;
    if (showError) await notify('error', result.message);
    return result;
  }
}

export async function uploadFile(
  endpoint: string,
  file: Blob,
  filename?: string,
  options?: CallApiOptions
) {
  const formData = new FormData();
  formData.append('file', file, filename);
  const result = await callApi<{ url: string }>('POST', endpoint, formData, options);
  if (!result.success || !result.data) return result;
  return { ...result, data: { ...result.data, url: apiAssetUrl(result.data.url) } };
}
